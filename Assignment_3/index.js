// models ----> controllers ---> routes ---> index.js
require("dotenv").config()  
const express = require("express")
const app = express()
const db = require("./config/db")
db()
const productRoutes = require("./routes/productRoutes")
const errorHandler = require("./middlewares/errorHandler")

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Inventory Management System")
})

app.use("/api/products",productRoutes)

// if no route matched, the URL is wrong
app.use((req,res)=>{
    res.status(404).json({message:"Route not found"})
})

// error handler must be the LAST middleware
app.use(errorHandler)

let PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log("Server is running on PORT " + PORT)
})
