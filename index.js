require('dotenv').config()
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const cors = require("cors")
const path = require("path");
const cookieParser = require("cookie-parser");
const ProductRoute = require("./routes/Product")
const UserRoute = require("./routes/User")

// MIDDLEWARES

app.use(cors({ credentials: true}))
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "/images")));
app.use(cookieParser());

// ROUTER 

app.use("/product",ProductRoute)
app.use("/user",UserRoute)

// URL DATABASE

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT} `)
})

mongoose.connect(MONGODB_URI)
.then(()=>{
    console.log("Connected To The DataBase Successfully!")
})
.catch((error)=>{
    console.log(error)
})