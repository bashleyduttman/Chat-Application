const express=require("express")
const RegisterRoute=require("./routes/RegisterRoute")
const cors=require("cors")
const connectDB = require("./config/db")
const authenticate = require("./middleware/authMiddleware")
const app=express()
connectDB()
app.use(cors())
app.use(express.json());
require('dotenv').config()
const PORT=process.env.PORT||3000

app.use('/api/users',RegisterRoute)
app.use(authenticate)
app.listen(PORT,()=>console.log(`server running on port ${PORT}`))