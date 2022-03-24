const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    customername:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    phone_number:{
        type: String,
        required: true
    },
    date_joined:{
        type: String,
        default: Date.now
    },
    role:{
        type: String,
        role: "guest",
    },
    customerInfo:{
        type: Array,
        required: false,
        default:[]
    }
})



module.exports = mongoose.model('Customer',customerSchema)