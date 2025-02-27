import validator from 'validator'
import bycrypt from 'bcrypt' 
import {v2 as cloudinary } from "cloudinary"
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
// API for adding doctor 
const addDoctor = async (req,res) => {

    try{

        const { name ,email, password,  speciality, degree, experience, about,  fees, address,} = req.body
        const  imageFile = req.file
    
 
       //checking for all data to add doctor
       if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address  ){
        return res.json({success:false,message:"Missing Details"})

       }

       //validating email format
       if (!validator.isEmail(email)) {
        return res.json({success:false,message:"Please enter a valid email"})

        }

    // validating strong password
    if (password.length < 8 ) {
        return res.json({success:false,message:"Please enter strong password"})
        
       }

      //hashing doctor password
      const salt = await bycrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      //upload image to cloudinary
      const imageupload = await cloudinary.uploader.upload(imageFile.path,{ressource_type:"image"})
      const imageUrl = imageupload.secure_url

      const doctorData = {

        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
         
      }


      const newDoctor = new doctorModel(doctorData)
      await newDoctor.save()

      res.json({success:true,message:"Doctor added"})
         

    }catch(error){
 
         console.log(error)
         res.json({success:false,message:error.message})
    }
}

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

export {addDoctor,loginAdmin}