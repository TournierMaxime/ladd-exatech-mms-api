import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchFAQ,
  createFAQ,
  getOneFAQ,
  updateFAQ,
  deleteFAQ
} from '../../controllers/FAQControllers.js'

const router = express.Router()

router.post('/search', expressAsyncHandler(searchFAQ))
router.post('/new', expressAsyncHandler(createFAQ))
router.get('/:faqId', expressAsyncHandler(getOneFAQ))
router.put('/:faqId', expressAsyncHandler(updateFAQ))
router.delete('/:faqId', expressAsyncHandler(deleteFAQ))

export default router
