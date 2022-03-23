const Customer = require('../models/customers')

const verifyEmail = (req, res, next) => {
    Customer.findOne({
        email: req.body.email
    }).exec((err, customer) => {
        if (err) return res.status(500).send({message: 'Email already in use'});
        if (customer) return res.status(400).send({message: 'Email already in use'});
        next();
    })
}

const verifyCredentials = verifyEmail

module.exports = verifyCredentials
