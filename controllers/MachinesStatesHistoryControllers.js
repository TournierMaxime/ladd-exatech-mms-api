import { Op } from 'sequelize'
import MachinesStatesHistory from '../models/MachinesStatesHistory.js'
import Machines from '../models/Machines.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import Errors from '../models/Errors.js'
import moment from 'moment/moment.js'
// import { sequelize } from '../lib/sequelize.js'

const searchMachinesStatesHistory = async (req, res) => {
  const { machineStateHistoryId, state, startDate, endDate, errorCode, errorLevel } = req.query
  const { machineId } = req.params

  const pageAsNumber = Number(req.query.page)
  const sizeAsNumber = Number(req.query.size)
  let page = 1
  let size = 50

  if (!Number.isNaN(pageAsNumber) && pageAsNumber >= 0) {
    page = pageAsNumber
  }

  if (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber <= 500) {
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

  if (machineStateHistoryId) {
    filters.push({
      machineStateHistoryId: {
        [Op.eq]: `${machineStateHistoryId}`
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

  if (startDate && endDate) {
    const start = moment(startDate, 'YYYY-MM-DD').toDate()
    const end = moment(endDate, 'YYYY-MM-DD').toDate()
    filters.push({
      createdAt: {
        [Op.between]: [start, end]
      }
    })
  } else if (startDate) {
    const start = moment(startDate, 'YYYY-MM-DD').startOf('day').toDate()
    const end = moment(startDate, 'YYYY-MM-DD').endOf('day').toDate()
    filters.push({
      createdAt: {
        [Op.between]: [start, end]
      }
    })
  } else if (endDate) {
    const start = moment(endDate, 'YYYY-MM-DD').startOf('day').toDate()
    const end = moment(endDate, 'YYYY-MM-DD').endOf('day').toDate()
    filters.push({
      createdAt: {
        [Op.between]: [start, end]
      }
    })
  }

  if (errorCode) {
    filters.push({
      '$Error.errorCode$': {
        [Op.eq]: `${errorCode}`
      }
    })
  }

  if (errorLevel) {
    filters.push({
      '$Error.errorLevel$': {
        [Op.eq]: `${errorLevel}`
      }
    })
  }

  const options = {
    where: {
      [Op.and]: filters
    },
    order: [['createdAt', 'DESC']],
    limit: size,
    offset: (page - 1) * size,
    distinct: true,
    include: [
      {
        model: Errors
      }
    ]
  }
  const count = await MachinesStatesHistory.count(options)
  const machinesStatesHistory = await MachinesStatesHistory.findAll(options)

  res.status(200).json({
    machinesStatesHistory,
    items: machinesStatesHistory.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createMachineStateHistory = async (req, res) => {
  const { machineId, errorId, state, data, ...otherProps } = req.body

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const machineStateHistory = await MachinesStatesHistory.create({
    machineId,
    errorId,
    state,
    data
  })

  res.status(201).json({
    message: 'Machine History created',
    data: machineStateHistory
  })
}

const getOneMachineStateHistory = async (req, res) => {
  const options = {
    where: { machineStateHistoryId: req.params.machineStateHistoryId },
    include: [
      {
        model: Machines
      },
      {
        model: Errors
      }
    ]
  }

  const machineStateHistory = await MachinesStatesHistory.findOne(options)

  if (!machineStateHistory) {
    throw new HttpNotFoundError('Machine History not found')
  }

  res.status(200).json({
    machineStateHistory
  })
}

const updateMachineStateHistory = async (req, res) => {
  const options = {
    where: { machineStateHistoryId: req.params.machineStateHistoryId }
  }
  const { machineId, errorId, state, data, ...otherProps } = req.body
  const machineStateHistory = await MachinesStatesHistory.findOne(options)

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  if (!machineStateHistory) {
    throw new HttpNotFoundError('Machine History not found')
  }

  machineStateHistory.update({
    ...req.body,
    machineStateHistoryId: req.params.machineStateHistoryId
  })

  res.status(201).json({
    message: 'Machine History updated',
    data: machineStateHistory
  })
}

const deleteMachineStateHistory = async (req, res) => {
  const options = {
    where: { machineStateHistoryId: req.params.machineStateHistoryId }
  }
  const machineStateHistory = await MachinesStatesHistory.findOne(options)

  if (!machineStateHistory) {
    throw new HttpNotFoundError('Machine History not found')
  }

  machineStateHistory.destroy()
  res.status(200).json({ message: 'Machine History has been deleted' })
}

export {
  searchMachinesStatesHistory,
  createMachineStateHistory,
  getOneMachineStateHistory,
  updateMachineStateHistory,
  deleteMachineStateHistory
}
