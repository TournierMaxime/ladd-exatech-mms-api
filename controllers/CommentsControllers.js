import { Op } from 'sequelize'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import Comments from '../models/Comments.js'
import Attachments from '../models/Attachments.js'
import Images from '../models/Images.js'
import Tickets from '../models/Tickets.js'
import fs from 'fs'
import fileCheckExtensions from '../lib/fileCheckExtensions.js'
// import { sequelize } from '../lib/sequelize.js'

const searchComments = async (req, res) => {
  const { commentId, userId } = req.query
  const { ticketId } = req.params

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

  if (commentId) {
    filters.push({
      commentId: {
        [Op.eq]: `${commentId}`
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

  if (userId) {
    filters.push({
      userId: {
        [Op.eq]: `${userId}`
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
      }
    ]
  }
  const count = await Comments.count(options)
  const comments = await Comments.findAll(options)

  // Cas de succès
  res.status(200).json({
    comments,
    items: comments.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createComment = async (req, res) => {
  const { text, userId, ticketId, ...otherProps } = req.body

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const existingComments = await Comments.findAll({ where: { ticketId } })

  if (existingComments.length === 0) {
    await Tickets.update({ status: 'in-progress' }, { where: { ticketId } })
  }

  const comment = await Comments.create({
    text,
    userId,
    ticketId
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
              )}/var/data/comments/temp/${file.filename}`
          }
        }
      })

    for (const file of req.files) {
      const oldPath = file.path
      const newPath = `var/data/tickets/${ticketId}/comments/${comment.commentId}/${file.filename}`
      fs.mkdirSync(`var/data/tickets/${ticketId}/comments/${comment.commentId}`, { recursive: true })
      fs.renameSync(oldPath, newPath)
      fileCheckExtensions(file, comment, req.protocol, req.host, 'comments', ticketId)
    }

    if (fs.existsSync(`var/data/tickets/${ticketId}/comments/temp`)) {
      fs.rmSync(`var/data/tickets/${ticketId}/comments/temp`, { recursive: true })
    }
  }

  res.status(201).json({
    message: 'Comment created',
    data: comment
  })
}

const getOneComment = async (req, res) => {
  const options = {
    where: { commentId: req.params.commentId },
    include: [
      {
        model: Attachments
      },
      {
        model: Images
      }
    ]
  }

  const comment = await Comments.findOne(options)

  if (!comment) {
    throw new HttpNotFoundError('Comment not found')
  }

  res.status(200).json({
    comment
  })
}

const updateComment = async (req, res) => {
  const options = {
    where: { commentId: req.params.commentId }
  }
  const { text, ...otherProps } = req.body
  const comment = await Comments.findOne(options)

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  if (!comment) {
    throw new HttpNotFoundError('Comment not found')
  }

  comment.update({ ...req.body, commentId: req.params.commentId })

  res.status(201).json({
    message: 'Comment updated',
    data: comment
  })
}

const deleteComment = async (req, res) => {
  const options = { where: { commentId: req.params.commentId } }
  const comment = await Comments.findOne(options)

  if (!comment) {
    throw new HttpNotFoundError('Comment not found')
  }

  if (fs.existsSync(`var/data/tickets/${comment.ticketId}/comments/${comment.commentId}`)) {
    fs.rmSync(`var/data/tickets/${comment.ticketId}/comments/${comment.commentId}`, { recursive: true })
  }

  comment.destroy()
  res.status(200).json({ message: 'Comment has been deleted' })
}

export { searchComments, createComment, getOneComment, updateComment, deleteComment }
