const express = require('express');
const { signup, login } = require('../controller/userController');
const {auth,isAdmin,isStudent} = require('../middlewares/auth')
const router = express.Router();
const User = require('../model/userSchema')

router.post('/signup',signup)
router.post('/login',login)


router.get('/test',auth,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the Auth route"
    })
})

router.get('/student',auth,isStudent,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the Student route"
    })
})
router.get('/admin',auth,isAdmin,(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to the Admin route"
    })
})

router.get('/getemail',auth,async(req,res)=>{
    try
    {
        const id = req.user.id;
        console.log(id);
        const user = await User.findById(id)
        res.status(200).json({
            success:true,       
            user:user,
            message:"Got the email"
        })

    }
    catch(err)
    {
        res.status(500).json({
            success:false,
            message:"Failed to catch mail"
        })
    }
})

module.exports = router