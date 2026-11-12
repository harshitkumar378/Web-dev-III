const mongoose = require("mongoose")

async function MONGODB_Connection(){
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb Connected")
    }catch(err){
        console.log(err)
    }
}
module.exports = MONGODB_Connection
