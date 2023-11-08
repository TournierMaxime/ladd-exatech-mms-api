import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchMachinesStatesHistory,
  createMachineStateHistory,
  getOneMachineStateHistory,
  updateMachineStateHistory,
  deleteMachineStateHistory
} from '../../controllers/MachinesStatesHistoryControllers.js'

const router = express.Router()

router.post('/:machineId/search', expressAsyncHandler(searchMachinesStatesHistory))
router.post('/new', expressAsyncHandler(createMachineStateHistory))
router.get('/:machineStateHistoryId', expressAsyncHandler(getOneMachineStateHistory))
router.put('/:machineStateHistoryId', expressAsyncHandler(updateMachineStateHistory))
router.delete('/:machineStateHistoryId', expressAsyncHandler(deleteMachineStateHistory))

export default router
