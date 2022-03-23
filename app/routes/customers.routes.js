const express = require('express')
const router = express.Router()
const Customer = require('../models/customers')
const  bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth.jwt')
const verifyEmail = require('../middleware/verification')
const {Subcription} = require('../middleware/finders')
const {findCustomer} = require('../middleware/finders')
const nodemailer = require('nodemailer')


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
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASS
                }
              });
              
              const mailOptions = {
                from: process.env.EMAIL,
                to: req.body.email,
                subject: "You have been registered successfully",
                text: `Thank you ${req.body.customername} for signing up with The Urban Shave 
                `
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
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
      
      let token = jwt.sign({ _id:  customer._id, role: customer.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        _id:  customer._id,
        customername:  customer.customername,
        email:  customer.email,
        role: customer.role,
        phone_number:  customer.phone_number,
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

router.patch('/',[verifyToken, findCustomer], async (req, res) => {
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
        // console.log(updatedCustomer)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASS
            }
          });
          
          const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: `${req.body.customername} your accout has been updated succesfully..`,
            text: `
            ${req.body.customername} Your account has been updated succesfully.
            `
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.json(updatedCustomer)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/',[ verifyToken, findCustomer], async (req, res) => {
    const  { customername , email } = res.customer
    try{
    
        await res.customer.remove()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASS
            }
          });
          
          const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: `${customername} your accout has been removed`,
            text: `thanks for using us
            `
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }try {
                res.json({ message: `thank you ${customername}, your email was sent`})
            } catch (error) {
                res.status(500).send( {message: error.message} )
            }
          });
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