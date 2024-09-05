let express = require('express');
let router = express.Router();
let userController = require('../controllers/users');
const { check } = require('express-validator');
const mongoose = require('mongoose');
let auth = require('../lib/auth')
const ObjectId = mongoose.Types.ObjectId;
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/register_admin',  [
  check('first_name', 'Please enter first name').notEmpty(),
  check('first_name', 'Please fill proper first name with minimum character').isLength({ min: 2, max: 30 }),
  check('last_name', 'Please enter last name').notEmpty(),
  check('last_name', 'Please fill proper last name with minimum character').isLength({ min: 2, max: 30 }),
  check('email', 'Please enter email.').notEmpty(),
  check('password', 'Please enter password.').notEmpty(),
  check('password', 'Please enter atlest 6 char unique password.').isLength({ min: 6, max: 18 }),
  check('email', 'Please enter Proper email address.').isEmail(),
  check('phone_number', 'Please enter valid phone number').notEmpty(),
  check('phone_number', 'Phone number should be number only.').isNumeric(),
  check('phone_number', 'Please enter 10 digit valid phone number.').isLength({ min: 10, max: 10 }),
], function (req, res) {
  userController.registerAdmin(req, res);
});



router.get("/user_details", [auth.authenticateUser], [auth.verifyJwtToken],[
  check('id', 'id is required').notEmpty(),
],
 function (req, res) {
  userController.userDetails(req, res);
});


module.exports = router;