import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchAPKs,
  createAPK,
  getOneAPK,
  updateAPK,
  deleteAPK
} from '../../controllers/APKControllers.js'
import { upload } from '../../middlewares/multer-config.js'

const router = express.Router()

router.post('/search', expressAsyncHandler(searchAPKs))
router.post('/new', upload, expressAsyncHandler(createAPK))
router.get('/:apkId', expressAsyncHandler(getOneAPK))
router.put('/:apkId', expressAsyncHandler(updateAPK))
router.delete('/:apkId', expressAsyncHandler(deleteAPK))

export default router
