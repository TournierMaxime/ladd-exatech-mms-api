/* eslint-disable n/no-callback-literal */
// Imports
import multer from 'multer'
import fs from 'fs'

// Valid extensions authorize
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/vnd.android.package-archive': 'apk'
}

let uploadPath = 'var/data/tickets/temp'

// Dossier de destination
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    const currentPath = req.baseUrl

    if (currentPath.includes('faq-sections') && /^(jpg|jpeg|png)$/.test(ext)) {
      uploadPath = 'var/data/faq/temp'
    } else if (currentPath.includes('tickets') && /^(png|jpg|jpeg|pdf|doc|docx|xlsx|xls)$/.test(ext)) {
      uploadPath = 'var/data/tickets/temp'
    } else if (currentPath.includes('interventions') && /^(png|jpg|jpeg|pdf|doc|docx|xlsx|xls)$/.test(ext)) {
      uploadPath = 'var/data/interventions/temp'
    } else if (currentPath.includes('apks') && /^(apk)$/.test(ext)) {
      uploadPath = 'var/data/apks/temp'
    }

    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath)
  },

  // Ajout du fichier dans le dossier
  filename: (req, file, cb) => {
    const fieldname = file.fieldname
    const extension = MIME_TYPES[file.mimetype]
    const uniqueSuffix = Date.now()
    if (extension === 'apk') {
      cb(null, `app-release.${extension}`)
    } else {
      cb(null, `${fieldname}-${uniqueSuffix}.${extension}`)
    }
  }

})

// Upload des fichiers
const upload = multer({
  fileFilter: (req, file, cb) => {
    const expectedExt = MIME_TYPES[file.mimetype]

    const actualExt = file.originalname.split('.').pop()

    if (expectedExt && expectedExt === actualExt) {
      cb(null, true)
    } else {
      return cb(new Error('Invalid file type'))
    }
  },

  // limits: { fileSize: 5 * 1024 * 1024 },

  storage
}).array('file')

export { upload }
