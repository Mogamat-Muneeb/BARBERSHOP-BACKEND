// require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const barberRouter = require('./app/routes/barbers.routes.js')
const bookingRouter = require('./app/routes/bookings.routes.js')
const customerRouter = require('./app/routes/customers.routes.js')
const contactRouter = require('./app/routes/contact.routes.js')


mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Barbershop Database'))



app.use(express.json())
app.use(cors())
app.get("/", (req, res) => {
    res.json({ message: "welcome to the Urban Shave..."})
})

app.use('/customers', customerRouter)
app.use('/barbers', barberRouter)
app.use('/barbers', bookingRouter)
app.use('/contact', contactRouter)




app.listen(process.env.PORT || 3000, () => console.log('Server Started'))