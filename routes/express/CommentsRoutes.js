import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchComments,
  createComment,
  getOneComment,
  updateComment,
  deleteComment
} from '../../controllers/CommentsControllers.js'
import { upload } from '../../middlewares/multer-config.js'

const router = express.Router()

router.post('/:ticketId/search', expressAsyncHandler(searchComments))
router.post('/new', upload, expressAsyncHandler(createComment))
router.get('/:commentId', expressAsyncHandler(getOneComment))
router.put('/:commentId', expressAsyncHandler(updateComment))
router.delete('/:commentId', expressAsyncHandler(deleteComment))

export default router
