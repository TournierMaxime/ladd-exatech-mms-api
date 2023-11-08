import { Op } from 'sequelize'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import FAQ from '../models/FAQ.js'
import FAQSection from '../models/FAQSection.js'
import Machines from '../models/Machines.js'
import FAQCategory from '../models/FAQCategory.js'
import Images from '../models/Images.js'

const searchFAQ = async (req, res) => {
  const { faqId, faqCategoryId, machineId, question, type, topic } = req.query

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

  if (faqId) {
    filters.push({
      faqId: {
        [Op.eq]: `${faqId}`
      }
    })
  }

  if (faqCategoryId) {
    filters.push({
      faqCategoryId: {
        [Op.eq]: `${faqCategoryId}`
      }
    })
  }

  if (machineId) {
    filters.push({
      machineId: {
        [Op.eq]: `${machineId}`
      }
    })
  }

  if (question) {
    filters.push({
      question: {
        [Op.like]: `${question}%`
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
        model: FAQSection,
        attributes: ['sectionId', 'faqId', 'type', 'content']
      },
      {
        model: Machines,
        attributes: ['type'],
        where: type
          ? { type: { [Op.like]: `${type}%` } }
          : undefined
      },
      {
        model: FAQCategory,
        attributes: ['topic'],
        where: topic
          ? { topic: { [Op.like]: `${topic}%` } }
          : undefined
      }
    ]
  }
  const count = await FAQ.count(options)
  const faq = await FAQ.findAll(options)

  // Cas de succès
  res.status(200).json({
    faq,
    items: faq.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createFAQ = async (req, res) => {
  const { question, machineId, faqCategoryId, ...otherProps } = req.body

  if (!question) {
    throw new HttpBadRequestError('Missing Question data')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const faq = await FAQ.create({
    question,
    machineId,
    faqCategoryId
  })

  res.status(201).json({
    message: 'FAQ created',
    data: faq
  })
}

const getOneFAQ = async (req, res) => {
  const options = {
    where: { faqId: req.params.faqId },
    order: [[FAQSection, 'createdAt', 'ASC']],
    include: [
      {
        model: FAQSection,
        include: {
          model: Images
        }
      },
      {
        model: Machines,
        attributes: ['machineId', 'type']
      },
      {
        model: FAQCategory,
        attributes: ['faqCategoryId', 'topic']
      }
    ]
  }

  const faq = await FAQ.findOne(options)

  if (!faq) {
    throw new HttpNotFoundError('FAQ not found')
  }

  res.status(200).json({
    faq
  })
}

const updateFAQ = async (req, res) => {
  const options = {
    where: { faqId: req.params.faqId }
  }
  const { question, answer, ...otherProps } = req.body
  const faq = await FAQ.findOne(options)

  if (!faq) {
    throw new HttpNotFoundError('FAQ not found')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  faq.update({ ...req.body, faqId: req.params.faqId })

  res.status(201).json({
    message: 'FAQ updated',
    data: faq
  })
}

const deleteFAQ = async (req, res) => {
  const options = { where: { faqId: req.params.faqId } }
  const faq = await FAQ.findOne(options)

  if (!faq) {
    throw new HttpNotFoundError('FAQ not found')
  }

  faq.destroy()
  res.status(200).json({ message: 'FAQ has been deleted' })
}

export { searchFAQ, createFAQ, getOneFAQ, updateFAQ, deleteFAQ }
