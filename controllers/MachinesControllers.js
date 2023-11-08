import { Op } from 'sequelize'
import Machines from '../models/Machines.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import MachinesStatesHistory from '../models/MachinesStatesHistory.js'
import Errors from '../models/Errors.js'
import { sequelize } from '../lib/sequelize.js'
import Tickets from '../models/Tickets.js'
import { discordClient } from '../servers/express.js'
import { deleteChannel } from '../lib/discord.js'
import fs from 'fs'

const searchMachines = async (req, res) => {
  const { machineId, type, code, state } = req.query

  const pageAsNumber = Number(req.query.page)
  const sizeAsNumber = Number(req.query.size)
  let page = 1
  let size = 10

  if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) {
    page = pageAsNumber
  }

  if (
    !Number.isNaN(sizeAsNumber) &&
      sizeAsNumber > 0 &&
      sizeAsNumber <= 500
  ) {
    size = sizeAsNumber
  }

  const filters = []

  if (machineId) {
    filters.push({
      machineId: {
        [Op.eq]: `${machineId}`
      }
    })
  }

  if (type) {
    filters.push({
      type: {
        [Op.like]: `${type}%`
      }
    })
  }

  if (code) {
    filters.push({
      code: {
        [Op.like]: `${code}%`
      }
    })
  }

  if (state) {
    filters.push({
      state: {
        [Op.eq]: `${state}`
      }
    })
  }

  const options = {
    where: {
      [Op.and]: filters
    },
    order: [['createdAt', 'DESC']],
    limit: size,
    offset: (page - 1) * size
  }
  const count = await Machines.count(options)
  const machines = await Machines.findAll(options)

  // Cas de succès
  res.status(200).json({
    machines,
    items: machines.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createMachine = async (req, res) => {
  const { type, code, data, ...otherProps } = req.body

  if (!type) {
    throw new HttpBadRequestError('Missing Type data')
  }

  if (!code) {
    throw new HttpBadRequestError('Missing Code data')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const machine = await Machines.create({
    type,
    code,
    data
  })

  res.status(201).json({
    message: 'Machine created',
    data: machine
  })
}

const getOneMachine = async (req, res) => {
  const options = {
    where: { machineId: req.params.machineId },
    include: [
      {
        model: MachinesStatesHistory
      },
      {
        model: Errors
      }
    ]
  }

  const machine = await Machines.findOne(options)

  if (!machine) {
    throw new HttpNotFoundError('Machine not found')
  }

  res.status(200).json({
    machine
  })
}

const updateMachine = async (req, res) => {
  const options = {
    where: { machineId: req.params.machineId }
  }
  const { type, code, data, ...otherProps } = req.body
  const machine = await Machines.findOne(options)

  if (!machine) {
    throw new HttpNotFoundError('Machine not found')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  machine.update({ ...req.body, machineId: req.params.machineId })

  res.status(201).json({
    message: 'Machine updated',
    data: machine
  })
}

const deleteMachine = async (req, res) => {
  const options = { where: { machineId: req.params.machineId } }
  const machine = await Machines.findOne(options)
  const server = discordClient.guilds.cache.get(process.env.DISCORD_SERVER_ID)

  const tickets = await Tickets.findAll({ where: { machineId: machine.machineId } })

  if (!machine) {
    throw new HttpNotFoundError('Machine not found')
  }

  for (const ticket of tickets) {
    await deleteChannel(server, ticket.ticketId)

    const ticketDirectory = `var/data/tickets/${ticket.ticketId}`
    if (fs.existsSync(ticketDirectory)) {
      fs.rmSync(ticketDirectory, { recursive: true })
    }
  }

  machine.destroy()
  res.status(200).json({ message: 'Machine has been deleted' })
}

const handleMachineStates = async (req, res) => {
  const machineId = req.params.machineId
  const { state, status, errorCode, errorLevel, ...otherProps } = req.body

  const t = await sequelize.transaction()

  let newErrorId = null
  let newState

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  if (!state && !status && !errorCode && !errorLevel) {
    newState = 'unknown'
    await Machines.update({
      state: newState
    }, {
      where: { machineId },
      transaction: t
    })

    await MachinesStatesHistory.create({
      machineId,
      state: newState
    }, { transaction: t })
  } else if (errorCode || errorLevel) {
    const [newError] = await Errors.findOrCreate({
      where: { errorCode, errorLevel },
      defaults: {
        errorCode,
        errorLevel
      },
      transaction: t
    })

    newErrorId = newError.errorId
    newState = 'ko'

    await Machines.update({
      state: newState,
      errorId: newErrorId
    }, {
      where: { machineId },
      transaction: t
    })

    await MachinesStatesHistory.create({
      machineId,
      errorId: newErrorId,
      state: newState
    }, { transaction: t })
  } else if (status === 'ok') {
    newState = 'ok'

    await Machines.update({
      state: newState,
      errorId: null
    }, {
      where: { machineId },
      transaction: t
    })

    await MachinesStatesHistory.create({
      machineId,
      state: newState
    }, { transaction: t })
  }

  await t.commit()

  res.status(201).json({ message: 'Success', state: newState })
}

export {
  searchMachines,
  createMachine,
  getOneMachine,
  updateMachine,
  deleteMachine,
  handleMachineStates
}
