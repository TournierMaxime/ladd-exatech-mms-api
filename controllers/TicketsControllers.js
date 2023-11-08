import { Op } from 'sequelize'
import Tickets from '../models/Tickets.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import Errors from '../models/Errors.js'
import Machines from '../models/Machines.js'
import Images from '../models/Images.js'
import Comments from '../models/Comments.js'
import fs from 'fs'
import { discordClient } from '../servers/express.js'
import { createChannel, deleteChannel } from '../lib/discord.js'
import fileCheckExtensions from '../lib/fileCheckExtensions.js'
import Interventions from '../models/Interventions.js'

const searchTickets = async (req, res) => {
  const { ticketId, title, status, provider } = req.query
  const { machineId } = req.params

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

  if (ticketId) {
    filters.push({
      ticketId: {
        [Op.eq]: `${ticketId}`
      }
    })
  }

  if (status) {
    filters.push({
      status: {
        [Op.eq]: `${status}`
      }
    })
  }

  if (provider) {
    filters.push({
      provider: {
        [Op.eq]: `${provider}`
      }
    })
  }

  if (title) {
    filters.push({
      title: {
        [Op.eq]: `${title}`
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
      },
      {
        model: Comments,
        attributes: ['commentId']
      }

    ]
  }

  const count = await Tickets.count(options)
  const tickets = await Tickets.findAll(options)

  // Cas de succès
  res.status(200).json({
    tickets,
    items: tickets.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createTicket = async (req, res) => {
  const { title, description, status, errorId, machineId, userId, provider, discordInviteLink, ...otherProps } = req.body
  const server = discordClient.guilds.cache.get(process.env.DISCORD_SERVER_ID)

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const ticket = await Tickets.create({
    title,
    description,
    status,
    errorId,
    machineId,
    userId,
    provider,
    discordInviteLink
  })

  if (req.files) {
    Object.values(req.files)
      .flat()
      .map((file) => {
        return {
          name: file.fieldname,
          types: file.mimetype,
          data: {
            filename: `${req.protocol}://${req.get(
                'host'
              )}/var/data/tickets/temp${file.filename}`
          }
        }
      })
  }

  for (const file of req.files) {
    const oldPath = file.path
    const newPath = `var/data/tickets/${ticket.ticketId}/${file.filename}`
    fs.mkdirSync(`var/data/tickets/${ticket.ticketId}`, { recursive: true })
    fs.renameSync(oldPath, newPath)
    fileCheckExtensions(file, ticket, req.protocol, req.host, 'tickets')
  }

  if (ticket.provider === 'Discord') {
    const images = await Images.findAll({ where: { ticketId: ticket.ticketId } })
    const inviteLink = await createChannel(server, ticket, images)
    ticket.discordInviteLink = inviteLink
    await ticket.save()
  }

  if (fs.existsSync('var/data/tickets/temp')) {
    fs.rmSync('var/data/tickets/temp', { recursive: true })
  }

  res.status(201).json({
    message: 'Ticket created',
    data: ticket
  })
}

const getOneTicket = async (req, res) => {
  const options = {
    where: { ticketId: req.params.ticketId },
    include: [
      {
        model: Machines,
        attributes: ['machineId', 'type']
      },
      {
        model: Errors,
        attributes: ['errorCode']
      },
      {
        model: Images,
        attributes: ['imagePath']
      },
      {
        model: Interventions,
        attributes: ['interventionId']
      }
    ]
  }

  const ticket = await Tickets.findOne(options)

  if (!ticket) {
    throw new HttpNotFoundError('Ticket not found')
  }

  res.status(200).json({
    ticket
  })
}

const updateTicket = async (req, res) => {
  const options = {
    where: { ticketId: req.params.ticketId }
  }
  const { title, description, status, file, ...otherProps } = req.body
  const ticket = await Tickets.findOne(options)

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  if (!ticket) {
    throw new HttpNotFoundError('Ticket not found')
  }

  ticket.update({ ...req.body, ticketId: req.params.ticketId })

  res.status(201).json({
    message: 'Ticket updated',
    data: ticket
  })
}

const deleteTicket = async (req, res) => {
  const options = { where: { ticketId: req.params.ticketId } }
  const ticket = await Tickets.findOne(options)
  const server = discordClient.guilds.cache.get(process.env.DISCORD_SERVER_ID)

  if (!ticket) {
    throw new HttpNotFoundError('Ticket not found')
  }

  deleteChannel(server, ticket.ticketId)

  if (fs.existsSync(`var/data/tickets/${ticket.ticketId}`)) {
    fs.rmSync(`var/data/tickets/${ticket.ticketId}`, { recursive: true })
  }

  ticket.destroy()
  res.status(200).json({ message: 'Ticket has been deleted' })
}

export { searchTickets, createTicket, getOneTicket, updateTicket, deleteTicket }
