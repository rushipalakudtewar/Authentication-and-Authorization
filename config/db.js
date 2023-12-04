const mongoose = require('mongoose')


const mongo_url = process.env.MONGOURL
const connectDB = () =>{
    mongoose.connect(`${mongo_url}`,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then((data)=>{
        console.log(`Mongodb connected to ${data.connection.host}`);
    })
    .catch((err)=>{
        console.log(`Failed to connect the DB ${err}` );
        process.exit(1)
    })
}

module.exports = connectDB