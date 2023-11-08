import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchInterventions,
  createIntervention,
  getOneIntervention,
  updateIntervention,
  deleteIntervention
} from '../../controllers/InterventionsControllers.js'
import { upload } from '../../middlewares/multer-config.js'

const router = express.Router()

router.post('/:machineId/search', expressAsyncHandler(searchInterventions))
router.post('/new', upload, expressAsyncHandler(createIntervention))
router.get('/:interventionId', expressAsyncHandler(getOneIntervention))
router.put('/:interventionId', expressAsyncHandler(updateIntervention))
router.delete('/:interventionId', expressAsyncHandler(deleteIntervention))

export default router
