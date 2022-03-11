const express = require('express')
const router = express.Router()
const Booking = require('../models/bookings')
const verifyToken = require('../middleware/auth.jwt')
const jwt = require('jsonwebtoken')
const verifybarberId = require('../middleware/verification')
// const {Subcription} = require('../middleware/finders')
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
        style: req.body.style,
        customerId: res.customer._id
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


router.put('/:id/bookings/:idbooking',[verifyToken, findCustomer, findBarber], async (req, res) => {
    if(req.userId.valueOf() != res.customer._id.valueOf()){
        return res.status(401).send({ message: "Unauthorized!" });
    }
    if(req.body.sessionNumber !=null){
        res.barber.customerInfo.forEach(customer => {
            if(customer._id.valueOf() == req.params.idbooking){
                customer.sessionNumber = req.body.sessionNumber
            }
        });
    }
    if(req.body.style !=null) {
        res.barber.customerInfo.forEach(customer => {
            if(customer._id.valueOf() == req.params.idbooking){
                customer.style = req.body.style
            }
        });
    }
    try{
        const updatedInfo = await res.barber.save()
        res.send(updatedInfo)
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})


router.delete('/:id/bookings',[verifyToken, findCustomer, findBarber], async (req, res) => {
    let barberArr = res.barber.customerInfo;
    let index = barberArr
      .map((booking) => {
        return booking._id;
      })
    try {
      barberArr.splice(index, 1);
      console.log(barberArr);
      const updatedPost = res.barber.save(barberArr);
      res.status(200).send({ message: " deleted successfully." });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
})


module.exports = router