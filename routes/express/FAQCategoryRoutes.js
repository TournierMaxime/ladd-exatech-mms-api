import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchFAQCategory,
  createFAQCategory,
  getOneFAQCategory,
  updateFAQCategory,
  deleteFAQCategory
} from '../../controllers/FAQCategoryControllers.js'

const router = express.Router()

router.post('/search', expressAsyncHandler(searchFAQCategory))
router.post('/new', expressAsyncHandler(createFAQCategory))
router.get('/:faqCategoryId', expressAsyncHandler(getOneFAQCategory))
router.put('/:faqCategoryId', expressAsyncHandler(updateFAQCategory))
router.delete('/:faqCategoryId', expressAsyncHandler(deleteFAQCategory))

export default router
