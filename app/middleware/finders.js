const Customer = require('../models/customers')
const Barber = require('../models/barbers')


async function findCustomer (req, res, next) {
    let customer
    try {
        customer = await Customer.findById(req.params.id)
        if (!customer) return res.status(404).send({ message: 'Customer not found'})
    } catch (error) {
        res.status(500).send({message: error.message});
    }
    res.customer = customer
    next()
}


async function findBarber (req, res, next) {
    let barber
    try {
        barber = await Barber.findById(req.params.id)
        if (!barber) return res.status(404).send({ message: 'Barber not found'})
    } catch (error) {
        res.status(500).send({message: error.message});
    }
    res.barber = barber
    next()
}

async function Subcription(req, res, next) {
    let subcription = 'user'


    let user = await Customer.findOne({customername: req.body.customername}).then((data) => { return data; });

    let updateSubcribe = await Customer.findById(user._id).updateOne({role: subcription}).then((data) => { return data});

    if(!user) {
        res.status(500);
        res.send('data not found')
    }
    else {
        res.status(200)
        res.send(user)
    }
}

module.exports = {
    findBarber: findBarber,
    findCustomer: findCustomer,
    Subcription: Subcription, 
}