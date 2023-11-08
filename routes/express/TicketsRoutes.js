import express from 'express'
import expressAsyncHandler from 'express-async-handler'
import {
  searchTickets,
  createTicket,
  getOneTicket,
  updateTicket,
  deleteTicket
} from '../../controllers/TicketsControllers.js'
import { upload } from '../../middlewares/multer-config.js'

const router = express.Router()

router.post('/:machineId/search', expressAsyncHandler(searchTickets))
router.post('/new', upload, expressAsyncHandler(createTicket))
router.get('/:ticketId', expressAsyncHandler(getOneTicket))
router.put('/:ticketId', expressAsyncHandler(updateTicket))
router.delete('/:ticketId', expressAsyncHandler(deleteTicket))

export default router
