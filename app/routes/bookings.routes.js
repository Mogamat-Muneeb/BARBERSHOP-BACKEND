const express = require('express')
const router = express.Router()
const Booking = require('../models/bookings')
const verifyToken = require('../middleware/auth.jwt')
const jwt = require('jsonwebtoken')
const verifyEmail = require('../middleware/verification')
const {Subcription} = require('../middleware/finders')
const {findCustomer} = require('../middleware/finders')
const {findBarber} = require('../middleware/finders')
const Customer = require('../models/customers')
const Barber = require('../models/barbers')


 router.get('/:id/bookings',[verifyToken,findBarber], (req, res) => {
    res.send(res.barber.customerInfo)
})

router.post('/:id/bookings',[verifyToken, findCustomer, findBarber], async (req, res) => {
    let barber_id = res.barber._id
    console.log(barber_id)
    let newBooking = new Booking({
        sessionNumber: req.body.sessionNumber,
        barberId: barber_id,
        style: req.body.style
    })
    let customerInfo = res.barber.customerInfo
    let addedToCustomerArr = false
    if(!addedToCustomerArr) customerInfo.push(newBooking)
    try {
        const updatedCustomerInfo = res.barber.save(customerInfo)
       res.status(200).send({message: "Customer info created"})
    } catch (err) {
        res.status(500).send({message: err.message })
    }
})

module.exports = router