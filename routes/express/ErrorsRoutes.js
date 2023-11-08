import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchErrors,
  createError,
  getOneError,
  updateError,
  deleteError
} from '../../controllers/ErrorsControllers.js'

const router = express.Router()

router.post('/search', expressAsyncHandler(searchErrors))
router.post('/new', expressAsyncHandler(createError))
router.get('/:errorId', expressAsyncHandler(getOneError))
router.put('/:errorId', expressAsyncHandler(updateError))
router.delete('/:errorId', expressAsyncHandler(deleteError))

export default router
