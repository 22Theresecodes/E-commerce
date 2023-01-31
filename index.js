const express = require ("express");
const app = express();
const mongoose = require ("mongoose")
const dotenv = require ("dotenv")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const logger = require("morgan")


dotenv.config()
mongoose.connect (process.env.MONGO_URL)
.then(()=>console.log("DB connected successfully"))
.catch((error)=>{
    console.log(error)
});

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(logger())

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)


app.listen(process.env.PORT || 5000,()=>{
 console.log("Backend server is running!")   
})
