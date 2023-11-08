import { Op } from 'sequelize'
import FAQCategory from '../models/FAQCategory.js'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import FAQ from '../models/FAQ.js'

const searchFAQCategory = async (req, res) => {
  const { faqCategoryId, topic } = req.query

  const filters = []

  if (faqCategoryId) {
    filters.push({
      faqCategoryId: {
        [Op.eq]: `${faqCategoryId}`
      }
    })
  }

  if (topic) {
    filters.push({
      topic: {
        [Op.like]: `${topic}%`
      }
    })
  }

  const options = {
    where: {
      [Op.and]: filters
    },
    order: [['topic', 'ASC']]
  }
  const count = await FAQCategory.count(options)
  const faqCategory = await FAQCategory.findAll(options)

  // Cas de succès
  res.status(200).json({
    faqCategory,
    items: faqCategory.length,
    results: count
  })
}

const createFAQCategory = async (req, res) => {
  const { topic, ...otherProps } = req.body

  if (!topic) {
    throw new HttpBadRequestError('Missing Topic data')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const faqCategory = await FAQCategory.create({
    topic
  })

  res.status(201).json({
    message: 'FAQ Category created',
    data: faqCategory
  })
}

const getOneFAQCategory = async (req, res) => {
  const options = {
    where: { faqCategoryId: req.params.faqCategoryId },
    include: [
      {
        model: FAQ
      }
    ]
  }

  const faqCategory = await FAQCategory.findOne(options)

  if (!faqCategory) {
    throw new HttpNotFoundError('FAQ Category not found')
  }

  res.status(200).json({
    faqCategory
  })
}

const updateFAQCategory = async (req, res) => {
  const options = {
    where: { faqCategoryId: req.params.faqCategoryId }
  }
  const { topic, ...otherProps } = req.body
  const faqCategory = await FAQCategory.findOne(options)

  if (!faqCategory) {
    throw new HttpNotFoundError('FAQ Category not found')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  faqCategory.update({ ...req.body, faqCategoryId: req.params.faqCategoryId })

  res.status(201).json({
    message: 'FAQ Category updated',
    data: faqCategory
  })
}

const deleteFAQCategory = async (req, res) => {
  const options = { where: { faqCategoryId: req.params.faqCategoryId } }
  const faqCategory = await FAQCategory.findOne(options)

  if (!faqCategory) {
    throw new HttpNotFoundError('FAQ Category not found')
  }

  faqCategory.destroy()
  res.status(200).json({ message: 'FAQ Category has been deleted' })
}

export { searchFAQCategory, createFAQCategory, getOneFAQCategory, updateFAQCategory, deleteFAQCategory }
