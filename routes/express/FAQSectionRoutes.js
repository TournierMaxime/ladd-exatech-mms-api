import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchFAQSection,
  createFAQSection,
  getOneFAQSection,
  updateFAQSection,
  deleteFAQSection
} from '../../controllers/FAQSectionControllers.js'
import { upload } from '../../middlewares/multer-config.js'

const router = express.Router()

router.post('/:faqId/search', expressAsyncHandler(searchFAQSection))
router.post('/new', upload, expressAsyncHandler(createFAQSection))
router.get('/:sectionId', expressAsyncHandler(getOneFAQSection))
router.put('/:sectionId', expressAsyncHandler(updateFAQSection))
router.delete('/:sectionId', expressAsyncHandler(deleteFAQSection))

export default router
