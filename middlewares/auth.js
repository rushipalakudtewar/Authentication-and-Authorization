const jwt=require('jsonwebtoken')


exports.auth = (req,res,next) =>{
    try
    {
        //we can access the token
        const token = req.body.token || req.cookies.token || req.header('Authorization').replace('Bearer ','');
        console.log("body",req.body.token)
        console.log("cookie",req.cookies.token)
        console.log("header",req.header('Authorization'))
        
        //we can access from cookies
        //const {token} = req.cookies.token;
        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:"Token missing"
            })
        }
        try
        {
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            // console.log(decode);
            req.user = decode;
        }
        catch(err)
        {
            return res.status(401).json({
                success:false,
                message:"Token Invalid"
            })
        }
        next()
    }
    catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Something is wrong"
        })
    }
}


exports.isStudent = (req,res,next) => {
    try
    {
        if(req.user.role!=="Student")
        {
            return res.status(401).json({
                success:false,
                message:"This is protected route for student"
            })
        }
        next();
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Failed to go student"
        })
    }
}


exports.isAdmin = (req,res,next) => {
    try
    {
        if(req.user.role!=="Admin")
        {
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin"
            })
        }
        next();
    }catch(err)
    {
        return res.status(500).json({
            success:false,
            message:"Failed to go admin"
        })
    }
}