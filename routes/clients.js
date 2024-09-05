let express = require('express');
let router = express.Router();
let clientController = require('../controllers/client');
const { check } = require('express-validator');
const mongoose = require('mongoose');
// let auth = require('../lib/auth')
const ObjectId = mongoose.Types.ObjectId;
/* GET users listing. */








router.post('/client_register',  [
    check('client_name', 'Please enter client name').notEmpty(),
    check('client_name', 'Please fill proper first name with minimum character').isLength({ min: 2, max: 30 }),
    check('industry', 'Please enter Industry name').notEmpty(),
    check('industry', 'Please fill proper industry with minimum character').isLength({ min: 2, max: 30 }),
    check('contact_information.email', 'Please enter email.').notEmpty(),
    check('contact_information.email', 'Please enter Proper email.').isEmail(),
    check('contact_information.phone_number', 'Please enter valid phone number').notEmpty(),
    check('contact_information.phone_number', 'Phone number should be number only.').isNumeric(),
    check('contact_information.phone_number', 'Please enter 10 digit valid phone number.').isLength({ min: 10, max: 10 }),
    check('contact_information.address', 'Please enter address').notEmpty(),
    check('contact_information.address', 'Please enter valid address').isLength({ min: 3, max: 300 })
  ], function (req, res) {
    clientController.createClient(req, res);
  });
  

module.exports = router;
