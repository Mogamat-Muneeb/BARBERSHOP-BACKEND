const express = require('express')
const router = express.Router()
const Customer = require('../models/customers')
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth.jwt')


router.get('/', async (req, res) => {
    try {
     const customers = await Customer.find()
     res.json(customers)
    } catch (err) {
     res.status(500).json({ message: err.message })
    }
 })

 router.get('/:id', getCustomer , (req, res) => {
    res.json(res.customer)
})

router.post('/register',Duplicates, async (req, res) => {
    try{ 
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const customer = new Customer({  customername: req.body.customername,
                        email: req.body.email,
                        password: hashedPassword,
                        phone_number: req.body.phone_number,
                        })
            const newCustomer = await customer.save()
            res.status(201).json(newCustomer)
            console.log(salt)
            console.log(hashedPassword)
    } catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.post('/login', async (req, res) => {
    try{ 
      Customer.findOne({ customername: req.body.customername} , (err, customer) => {
          if(err) return handleError(err);
      if (!customer) {
        return res.status(404).send({ message: "User Not found." });
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        customer.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      
      let token = jwt.sign({ _id:  customer._id, cart: customer.cart }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        _id:  customer._id,
        customername:  customer.customername,
        email:  customer.email,
        accessToken: token
      });
    })
    } catch(err){
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id',[getCustomer,verifyToken], async (req, res) => {
    if(req.params.id != req.customerId){
        return res.status(401).send({ message: "Unauthorized!" });
    }
    if(req.body.customername !=null){
        res.customer.customername =  req.body.customername
    }
    if(req.body.email !=null) {
        res.customer.email = req.body.email
    }
    if(req.body.password !=null){
        res.customer.password =  req.body.password
    }
    if(req.body.phone_number !=null){
        res.customer.phone_number =  req.body.phone_number
    }
    
    try{
        const updatedCustomer = await res.customer.save()
        res.json(updatedCustomer)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id',[getCustomer,verifyToken], async (req, res) => {
    try{
        if(req.params.id != req.customerId){
            return res.status(401).send({ message: "Unauthorized!" });
        }
        await res.customer.remove()
        res.json({ message:'Deleted customer'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 



 async function getCustomer(req, res, next) {
     let customer
    try{
        customer = await Customer.findById(req.params.id)
       if(customer == null){
           return res.status(404).json({ message:'Cannot find customer' })
       } 
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.customer = customer
    next()
}


async function Duplicates(req, res, next){
    let customer 
    
    try{
        customer = await Customer.findOne({customername: req.body.customername})
        email = await Customer.findOne({email: req.body.email})
        if(customer || email){
            return res.status(404).send({ message:"customername or email already in exits"});
        }
      } catch(err){
        return res.status(500).send({ message:err.message})
    }
    next()
    }




















 module.exports = router