require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Barbershop Database'))

app.use(express.json())
app.use(cors())


const customerRouter = require('./app/routes/customers.routes.js')
app.use('/customers', customerRouter)

app.listen(process.env.PORT || 3000, () => console.log('Server Started'))