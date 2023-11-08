import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchMachines,
  createMachine,
  getOneMachine,
  updateMachine,
  deleteMachine,
  handleMachineStates
} from '../../controllers/MachinesControllers.js'

const router = express.Router()

router.post('/search', expressAsyncHandler(searchMachines))
router.post('/new', expressAsyncHandler(createMachine))
router.get('/:machineId', expressAsyncHandler(getOneMachine))
router.put('/:machineId', expressAsyncHandler(updateMachine))
router.delete('/:machineId', expressAsyncHandler(deleteMachine))
router.post('/:machineId/states', expressAsyncHandler(handleMachineStates))

export default router
