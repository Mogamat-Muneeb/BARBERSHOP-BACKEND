const mongoose = require('mongoose')

const barberSchema = new mongoose.Schema({
    barberName:{
        type: String,
        required: true
    },
    customerInfo:{
        type: Array,
        required: false,
        default:[]
    }

})



module.exports = mongoose.model('Barber',barberSchema)