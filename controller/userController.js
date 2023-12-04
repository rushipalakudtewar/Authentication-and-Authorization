const User = require('../model/userSchema')
const mongoose= require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signup = async(req,res) =>{
        try{
        const {name,email,password,role} = req.body;

        const existinguser = await User.findOne({email})
        if(existinguser)
        {
            return res.status(400).json({ 
                success:false,
                message:"User already exists"
            })
        }

        let hashedpassword;
        try
        {
            hashedpassword = await bcrypt.hash(password,10)
        }
        catch(err)
        {
            return res.status(400).json({
                success:false,
                message:"Failed to bcrypt password"
            })
        }
        const createduser = await User.create({
            name,email,password:hashedpassword,role
        })

        res.status(201).json({
            success:true,
            message:"User Created Successfully",
            data:createduser
        })
    }
    catch(err)
    {
        return res.status(400).json({
            success:false,
            err:`Failed to create user ${err}`
        })
    }

}

exports.login = async(req,res)=>{
    try
    {

        const {email,password} = req.body;  
        if(!email && !password)
        {
            return res.status(400).json({
                message:"Please fill the fields"
            })
        }
        const user = await User.findOne({email})
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role
        }
        if(await bcrypt.compare(password,user.password))
        {   
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h'
            })
            // user = user.toObject()
            user.token = token;
            user.password = undefined;
    
            const options={
                expires:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true
            }
            res.cookie('token',token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully"
            })
            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:"User logged in successfully"
            // })
        }
        else
        {
            res.status(403).json({
                success:false,
                message:"Password is incorrect"
            })
        }
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:`Login failure ${err}`
        })
    }
}