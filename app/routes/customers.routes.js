const express = require('express')
const router = express.Router()
const Customer = require('../models/customers')
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth.jwt')
const verifyEmail = require('../middleware/verification')
const {Subcription} = require('../middleware/finders')
const {findCustomer} = require('../middleware/finders')



router.get('/', async (req, res) => {
 
    try {
     const customers = await Customer.find()
     res.json(customers)
    } catch (err) {
     res.status(500).json({ message: err.message })
    }
 })

 router.get('/:id', findCustomer , (req, res) => {
    res.json(res.customer)
})

router.post('/register',verifyEmail, async (req, res) => {
    try{ 
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const customer = new Customer({  customername: req.body.customername,
                        email: req.body.email,
                        password: hashedPassword,
                        phone_number: req.body.phone_number,
                        role: 'guest'
                        })
            const newCustomer = await customer.save()
            res.status(201).json(newCustomer)
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

router.patch('/subcribe', Subcription, async (req, res) => {
    if(req.params.id != req.customerId){
        return res.status(401).send({ message: "Unauthorized!" });
    }
    if(req.body.customername !=null){
        res.customer.customername =  req.body.customername
    }
    try{
        const updatedCustomer = await res.customer.save()
        res.json(updatedCustomer)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}
)

router.patch('/:id',[findCustomer,verifyToken], async (req, res) => {
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

router.delete('/:id',[ findCustomer,verifyToken], async (req, res) => {
    try{
        if(req.params.id != req.customerId){
            return res.status(401).send({ message: "Unauthorized!" });
        }
        await res.customer.remove()
        // res.json({ message:'Deleted customer'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 







// async function Duplicates(req, res, next){
//     let customer 
    
//     try{
//         customer = await Customer.findOne({customername: req.body.customername})
//         email = await Customer.findOne({email: req.body.email})
//         if(customer || email){
//             return res.status(404).send({ message:"customername or email already in exits"});
//         }
//       } catch(err){
//         return res.status(500).send({ message:err.message})
//     }
//     next()
//     }


 async function Booking(req, res,next) {
    //  let {subscription} = req.body


    // let user = await Customer.findOne({customername: req.body.customername}).then((data) => { return data[0]; });

    // if(!user) {
    //     res.status(500);
    //     res.send('data not found')
    // }
    // else {
    //     res.status(200)
    //     res.send(user)
    // }
 }



















 module.exports = router