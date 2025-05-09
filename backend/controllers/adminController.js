import validator from 'validator'
import bcrypt from 'bcrypt' 
import {v2 as cloudinary } from "cloudinary"
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'
dotenv.config()

// API for adding doctor 
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    // Check if all required fields are present
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Validate individual string fields
    if (!name.trim()) {
      return res.json({ success: false, message: "Doctor name cannot be empty" });
    }

    if (!degree.trim()) {
      return res.json({ success: false, message: "Doctor degree cannot be empty" });
    }

    if (!about.trim()) {
      return res.json({ success: false, message: "About doctor section cannot be empty" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageupload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
    const imageUrl = imageupload.secure_url;

    // Create doctor data
    const doctorData = {
      name: name.trim(),
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree: degree.trim(),
      experience,
      about: about.trim(),
      fees,
      address: JSON.parse(address),
      date: Date.now()
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//API for admin Login

const loginAdmin = async (req,res) => {

    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success:true,token})


            
        } else{
            res.json({success:false,message:"Invalid Credentials"})
        }
    } 
    catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
        
    }
}


// API to get get all doctors list

 const allDoctors = async (req,res) => {

    try {

        const doctors = await doctorModel.find({}).select("-password")
        res.json({success:true,doctors})

    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
        
    }
  }


  // API to get all appointment list 

  const appointmentsAdmin = async (req,res) => {

 try {
    
    const appointments =await appointmentModel.find({})
    res.json({success:true,appointments})

 } catch (error) {
    console.log(error)
        res.json({success:false,message:error.message})
    
 }

  }

//API for appointment cancellation


const appointementCancel = async (req, res) => {
  try {
    const {  appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

   

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    //Releseing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get dashboard data for admin panel

const adminDashboard = async (req,res) => {

    try {
        
       const doctors = await doctorModel.find({})
       const users = await userModel.find({})
       const appointments = await appointmentModel.find({})

       const dashData = {
        doctors: doctors.length,
        appointments:appointments.length,
        patients:users.length,
        latestAppointments: appointments.reverse().slice(0,5)
       }

       res.json({success:true,dashData})

    } catch (error) {
        console.log(error);
    res.json({ success: false, message: error.message });
    }
}


export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointementCancel,adminDashboard }  //exporting all the functions to use in routes