//import mongoose
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/Bank_server",{
    useNewUrlParser:true
})

//defining model
const Account= mongoose.model("Account",{
    account_no:Number,
    name:String,
    phone:Number,
    balance:Number,
    password:String,
    transactions:[]
})

module.exports={
    Account
}