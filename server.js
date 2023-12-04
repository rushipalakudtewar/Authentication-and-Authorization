const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/db')
const userRoute = require('./route/userRoute')
connectDB();
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const port = process.env.PORT || 8080


app.use(express.json())

app.use('/api/v1',userRoute)
app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}`);
})