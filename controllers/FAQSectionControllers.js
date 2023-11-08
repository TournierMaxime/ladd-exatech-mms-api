import { Op } from 'sequelize'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import FAQSection from '../models/FAQSection.js'
import fs from 'fs'
import fileCheckExtensions from '../lib/fileCheckExtensions.js'

const searchFAQSection = async (req, res) => {
  const { sectionId, faqId, type } = req.query

  const filters = []

  if (sectionId) {
    filters.push({
      sectionId: {
        [Op.eq]: `${sectionId}`
      }
    })
  }

  if (faqId) {
    filters.push({
      faqId: {
        [Op.eq]: `${faqId}`
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

  const options = {
    where: {
      [Op.and]: filters
    },
    order: [['createdAt', 'DESC']]
  }
  const count = await FAQSection.count(options)
  const faqSection = await FAQSection.findAll(options)

  // Cas de succès
  res.status(200).json({
    faqSection,
    items: faqSection.length,
    results: count
  })
}

const createFAQSection = async (req, res) => {
  const { content, type, faqId, file, ...otherProps } = req.body

  if (!content) {
    throw new HttpBadRequestError('Missing Content data')
  }

  if (!type) {
    throw new HttpBadRequestError('Missing Type data')
  }

  if (!faqId) {
    throw new HttpBadRequestError('Missing faqId data')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  const faqSection = await FAQSection.create({
    content,
    type,
    faqId,
    file
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
              )}/var/data/faq-sections/temp${file.filename}`
          }
        }
      })

    for (const file of req.files) {
      const oldPath = file.path
      const newPath = `var/data/faq/${faqId}/faq-sections/${faqSection.sectionId}/${file.filename}`
      fs.mkdirSync(`var/data/faq/${faqId}/faq-sections/${faqSection.sectionId}`, { recursive: true })
      fs.renameSync(oldPath, newPath)
      fileCheckExtensions(file, faqSection, req.protocol, req.host, 'faq-sections', faqId)
    }
    if (fs.existsSync(`var/data/faq/${faqId}/faq-sections/temp`)) {
      fs.rmSync(`var/data/faq/${faqId}/faq-sections/temp`, { recursive: true })
    }
  }

  res.status(201).json({
    message: 'FAQSection created',
    data: faqSection
  })
}

const getOneFAQSection = async (req, res) => {
  const options = {
    where: { sectionId: req.params.sectionId }
  }

  const faqSection = await FAQSection.findOne(options)

  if (!faqSection) {
    throw new HttpNotFoundError('FAQSection not found')
  }

  res.status(200).json({
    faqSection
  })
}

const updateFAQSection = async (req, res) => {
  const options = {
    where: { sectionId: req.params.sectionId }
  }
  const { content, type, file, ...otherProps } = req.body
  const faqSection = await FAQSection.findOne(options)

  if (!faqSection) {
    throw new HttpNotFoundError('FAQSection not found')
  }

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  faqSection.update({ ...req.body, sectionId: req.params.sectionId })

  res.status(201).json({
    message: 'FAQSection updated',
    data: faqSection
  })
}

const deleteFAQSection = async (req, res) => {
  const options = { where: { sectionId: req.params.sectionId } }
  const faqSection = await FAQSection.findOne(options)

  if (!faqSection) {
    throw new HttpNotFoundError('FAQSection not found')
  }

  if (fs.existsSync(`var/data/faq/${faqSection.faqId}`)) {
    fs.rmSync(`var/data/faq/${faqSection.faqId}`, { recursive: true })
  }

  faqSection.destroy()
  res.status(200).json({ message: 'FAQSection has been deleted' })
}

export { searchFAQSection, createFAQSection, getOneFAQSection, updateFAQSection, deleteFAQSection }
