
let jwt = require("jsonwebtoken");
const User = require("../models/user");


const isAuthenticated = function (data) {
  return async (req, res, next) => {
    jwt.verify(
      req.headers.token,
      process.env.jwt_secret,
      function (err, decoded) {
        return decoded;
      }
    );
  };
};


const authenticateUser = async (req, res, next) => {
  const token = req.headers.token ? req.headers.token : req.query.token;
  console.log(token,"TTTTOOOOOOOKKKEEENNNNNNNNN")
  const decoded = jwt.decode(token, process.env.jwt_secret);
  console.log(decoded,'DDDDDEECCOD')
  try {
    let userData = {};
    
    if (decoded.user_type === 'super_admin') {
      
      userData = await User.findById(decoded.user_id).exec();
      
      userData.user_type = 'super_admin';
    }
    if (decoded.user_type === 'admin') {
      userData = await User.findById(decoded.user_id).exec();
      userData.user_type = 'admin';
    }
    if (decoded.user_type === 'client_user') {
      userData = await User.findById(decoded.user_id).exec();
      userData.user_type = 'client_user';
    }
    req.user = userData;
    
    return next(null, userData);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      title: "Authorization required.",
      error: true,
    });
  }
};

const verifyJwtToken = async (req, res, next) => {
  const token = req.headers.token ? req.headers.token : req.query.token;

  jwt.verify(token, process.env.jwt_secret, (err, user) => {
    if (err) {
      return res.status(200).json({
        title: "Session is expired please log in again.",
        error: true,
      });
    }
    return next(null, user);
  });

}

module.exports = {
  isAuthenticated,
  authenticateUser,
  verifyJwtToken
};