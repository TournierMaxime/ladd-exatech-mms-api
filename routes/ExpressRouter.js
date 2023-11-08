import { Router } from 'express'
import MachinesRoutes from './express/MachinesRoutes.js'
import MachinesStatesHistoryRoutes from './express/MachinesStatesHistoryRoutes.js'
import ErrorsRoutes from './express/ErrorsRoutes.js'
import TicketsRoutes from './express/TicketsRoutes.js'
import CommentsRoutes from './express/CommentsRoutes.js'
import FAQCategoryRoutes from './express/FAQCategoryRoutes.js'
import FAQRoutes from './express/FAQRoutes.js'
import FAQSectionRoutes from './express/FAQSectionRoutes.js'
import InterventionsRoutes from './express/InterventionsRoutes.js'
import APKRoutes from './express/APKRoutes.js'

const router = Router()

router.use('/api/v1/machines', MachinesRoutes)
router.use('/api/v1/machines-states-history', MachinesStatesHistoryRoutes)
router.use('/api/v1/errors', ErrorsRoutes)
router.use('/api/v1/tickets', TicketsRoutes)
router.use('/api/v1/comments', CommentsRoutes)
router.use('/api/v1/faq-category', FAQCategoryRoutes)
router.use('/api/v1/faq', FAQRoutes)
router.use('/api/v1/faq-sections', FAQSectionRoutes)
router.use('/api/v1/interventions', InterventionsRoutes)
router.use('/api/v1/apks', APKRoutes)

export default router
