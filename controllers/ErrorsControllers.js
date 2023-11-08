import { Op } from 'sequelize'
import Errors from '../models/Errors.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'

const searchErrors = async (req, res) => {
  const { errorId, errorCode, errorLevel } = req.query

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
      sizeAsNumber <= 10
  ) {
    size = sizeAsNumber
  }

  const filters = []

  if (errorId) {
    filters.push({
      errorId: {
        [Op.eq]: `${errorId}`
      }
    })
  }

  if (errorCode) {
    filters.push({
      errorCode: {
        [Op.eq]: `${errorCode}`
      }
    })
  }

  if (errorLevel) {
    filters.push({
      errorLevel: {
        [Op.eq]: `${errorLevel}`
      }
    })
  }

  const options = {
    where: {
      [Op.and]: filters
    },
    limit: size,
    offset: (page - 1) * size,
    order: [['errorId', 'DESC']]
  }
  const count = await Errors.count(options)
  const errors = await Errors.findAll(options)

  // Cas de succès
  res.status(200).json({
    errors,
    items: errors.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createError = async (req, res) => {
  const { errorCode, errorLevel, message, description, ...otherProps } = req.body

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const [error, created] = await Errors.findOrCreate({
    where: { errorCode },
    defaults: { errorCode, errorLevel, message, description }
  })

  if (created) {
    res.status(201).json({
      message: 'Error created',
      data: error
    })
  } else {
    throw new HttpBadRequestError('Error already created')
  }
}

const getOneError = async (req, res) => {
  const options = {
    where: { errorId: req.params.errorId }
  }

  const error = await Errors.findOne(options)

  if (!error) {
    throw new HttpNotFoundError('Error not found')
  }

  res.status(200).json({
    error
  })
}

const updateError = async (req, res) => {
  const options = {
    where: { errorId: req.params.errorId }
  }
  const { errorCode, errorLevel, message, description, ...otherProps } = req.body
  const error = await Errors.findOne(options)

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  if (!error) {
    throw new HttpNotFoundError('Error not found')
  }

  error.update({ ...req.body, errorId: req.params.errorId })

  res.status(201).json({
    message: 'Error updated',
    data: error
  })
}

const deleteError = async (req, res) => {
  const options = { where: { errorId: req.params.errorId } }
  const error = await Errors.findOne(options)

  if (!error) {
    throw new HttpNotFoundError('Error not found')
  }

  error.destroy()
  res.status(200).json({ message: 'Error has been deleted' })
}

export { searchErrors, createError, getOneError, updateError, deleteError }
