import { Op } from 'sequelize'
import { HttpBadRequestError, HttpNotFoundError } from '../lib/errors.js'
import APK from '../models/APK.js'
import fs from 'fs'

const searchAPKs = async (req, res) => {
  const { apkId, versionCode, versionName, apkUrl } = req.query

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

  if (apkId) {
    filters.push({
      apkId: {
        [Op.eq]: `${apkId}`
      }
    })
  }

  if (versionCode) {
    filters.push({
      versionCode: {
        [Op.eq]: `${versionCode}`
      }
    })
  }

  if (versionName) {
    filters.push({
      versionName: {
        [Op.eq]: `${versionName}`
      }
    })
  }

  if (apkUrl) {
    filters.push({
      apkUrl: {
        [Op.eq]: `${apkUrl}`
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
  const count = await APK.count(options)
  const apks = await APK.findAll(options)

  // Cas de succès
  res.status(200).json({
    apks,
    items: apks.length,
    results: count,
    page,
    totalPages: Math.ceil(count / size)
  })
}

const createAPK = async (req, res) => {
  const { versionCode, versionName, file, ...otherProps } = req.body

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  if (req.files && req.files.length > 0) {
    const file = req.files[0]

    const apkPath = `var/data/apks/${versionName}/${file.filename}`
    fs.mkdirSync(`var/data/apks/${versionName}`, { recursive: true })
    fs.renameSync(file.path, apkPath)

    const apkUrl = `${req.protocol}://${req.get('host')}/${apkPath}`

    const apk = await APK.create({
      versionCode,
      versionName,
      apkUrl,
      file
    })

    res.status(201).json({
      message: 'APK created',
      data: apk
    })
  } else {
    throw new HttpBadRequestError('APK file is required')
  }
}

const getOneAPK = async (req, res) => {
  const options = {
    where: { apkId: req.params.apkId }
  }

  const apk = await APK.findOne(options)

  if (!apk) {
    throw new HttpNotFoundError('APK not found')
  }

  res.status(200).json({
    apk
  })
}

const updateAPK = async (req, res) => {
  const options = {
    where: { apkId: req.params.apkId }
  }
  const { versionCode, versionName, apkUrl, ...otherProps } = req.body
  const apk = await APK.findOne(options)

  if (Object.keys(otherProps).length > 0) {
    throw new HttpBadRequestError('Invalid data provided')
  }

  if (!apk) {
    throw new HttpNotFoundError('APK not found')
  }

  apk.update({ ...req.body, apkId: req.params.apkId })

  res.status(201).json({
    message: 'APK updated',
    data: apk
  })
}

const deleteAPK = async (req, res) => {
  const options = { where: { apkId: req.params.apkId } }
  const apk = await APK.findOne(options)

  if (!apk) {
    throw new HttpNotFoundError('APK not found')
  }

  if (fs.existsSync(`var/data/apks/${apk.versionName}`)) {
    fs.rmSync(`var/data/apks/${apk.versionName}`, { recursive: true })
  }

  apk.destroy()
  res.status(200).json({ message: 'APK has been deleted' })
}

export { searchAPKs, createAPK, getOneAPK, updateAPK, deleteAPK }
