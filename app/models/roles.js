const mongoose = require('mongoose')

const rolesSchema = new mongoose.Schema({
    rolename:{
        type: String,
        required: true
    },
  
})



module.exports = mongoose.model('Roles',rolesSchema)