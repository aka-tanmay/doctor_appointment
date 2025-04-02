import express from 'express'
import { addDoctor,allDoctors,loginAdmin, appointmentsAdmin, appointementCancel} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js '
import authAdmin from '../middlewares/authadmin.js'
import { changeAvilability } from '../controllers/doctorController.js'

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvilability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointementCancel)



export default adminRouter