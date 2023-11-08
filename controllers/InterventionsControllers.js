import { Op } from 'sequelize'
import { HttpNotFoundError } from '../lib/errors.js'
import Attachments from '../models/Attachments.js'
import Images from '../models/Images.js'
import Interventions from '../models/Interventions.js'
import fs from 'fs'
import fileCheckExtensions from '../lib/fileCheckExtensions.js'
import Tickets from '../models/Tickets.js'
import moment from 'moment'
import Machines from '../models/Machines.js'
// import { sequelize } from '../lib/sequelize.js'

const searchInterventions = async (req, res) => {
  const { interventionId, mode, status, result, title, plannedInterventionDate, realInterventionDate } = req.query
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

  if (interventionId) {
    filters.push({
      interventionId: {
        [Op.eq]: `${interventionId}`
      }
    })
  }

  if (mode) {
    filters.push({
      mode: {
        [Op.eq]: `${mode}`
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

  if (result) {
    filters.push({
      result: {
        [Op.eq]: `${result}`
      }
    })
  }

  if (plannedInterventionDate) {
    const date = moment(plannedInterventionDate, 'DD/MM/YYYY').toDate()
    filters.push({
      plannedInterventionDate: {
        [Op.eq]: date
      }
    })
  }

  if (realInterventionDate) {
    const date = moment(realInterventionDate, 'DD/MM/YYYY').toDate()
    filters.push({
      realInterventionDate: {
        [Op.eq]: date
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
        model: Attachments
      },
      {
        model: Images
      },
      {
        model: Tickets,
        attributes: ['ticketId', 'title'],
        where: title
          ? { title: { [Op.like]: `${title}%` } }
          : undefined
      },
      {
        model: Machines,
        attributes: ['type']
      }
    ]
  }
  const count = await Interventions.count(options)
  const interventions = await Interventions.findAll(options)

  // Cas de succès
  res.status(200).json({
    interventions,
    items: interventions.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createIntervention = async (req, res) => {
  const data = req.body

  const intervention = await Interventions.create({
    ...data
  })

  if (req.files && req.files.length > 0) {
    Object.values(req.files)
      .flat()
      .map((file) => {
        return {
          name: file.fieldname,
          types: file.mimetype,
          data: {
            filename: `${req.protocol}://${req.get(
                'host'
              )}/var/data/interventions/temp/${file.filename}`
          }
        }
      })

    for (const file of req.files) {
      const oldPath = file.path
      const newPath = `var/data/interventions/${intervention.interventionId}/${file.filename}`
      fs.mkdirSync(`var/data/interventions/${intervention.interventionId}`, { recursive: true })
      fs.renameSync(oldPath, newPath)
      fileCheckExtensions(file, intervention, req.protocol, req.host, 'interventions')
    }

    if (fs.existsSync(`var/data/interventions/${intervention.interventionId}/temp`)) {
      fs.rmSync(`var/data/interventions/${intervention.interventionId}/temp`, { recursive: true })
    }
  }

  res.status(201).json({
    message: 'Intervention created',
    data: intervention
  })
}

const getOneIntervention = async (req, res) => {
  const options = {
    where: { interventionId: req.params.interventionId },
    include: [
      {
        model: Attachments
      },
      {
        model: Images
      },
      {
        model: Tickets,
        attributes: ['ticketId', 'title']
      }
    ]
  }

  const intervention = await Interventions.findOne(options)

  if (!intervention) {
    throw new HttpNotFoundError('Intervention not found')
  }

  res.status(200).json({
    intervention
  })
}

const updateIntervention = async (req, res) => {
  const options = {
    where: { interventionId: req.params.interventionId }
  }
  const data = req.body
  const intervention = await Interventions.findOne(options)

  if (!intervention) {
    throw new HttpNotFoundError('Intervention not found')
  }

  intervention.update({ ...data, interventionId: req.params.interventionId })

  res.status(201).json({
    message: 'Intervention updated',
    data: intervention
  })
}

const deleteIntervention = async (req, res) => {
  const options = { where: { interventionId: req.params.interventionId } }
  const intervention = await Interventions.findOne(options)

  if (!intervention) {
    throw new HttpNotFoundError('Intervention not found')
  }

  if (fs.existsSync(`var/data/interventions/${intervention.interventionId}`)) {
    fs.rmSync(`var/data/interventions/${intervention.interventionId}`, { recursive: true })
  }

  intervention.destroy()
  res.status(200).json({ message: 'Intervention has been deleted' })
}

export { searchInterventions, createIntervention, getOneIntervention, updateIntervention, deleteIntervention }
