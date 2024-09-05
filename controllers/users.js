const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");





const createUserInstance = ({
    email,
    first_name,
    last_name,
    phone_number,
    marital_status,
    profile_picture,
    user_type,
    date_of_joining,
    company_id,
}) => {
    return new User({
        email,
        first_name,
        last_name,
        phone_number,
        marital_status,
        profile_picture,
        user_type,
        is_active: false,
        date_of_joining,
        company_id,
        is_company_registred: true,
        is_employee_registred: true,
        is_team_registred: true,
    });
};


const registerAdmin = async (req, res) => {
    try {
        const result = validationResult(req);
        if (result.errors.length > 0) {
            return res.status(200).json({
                error: true,
                title: result.errors[0].msg,
                errors: result,
            });
        }
        let pan_data = "";
        const { first_name, last_name, email,password, phone_number
        ,pan_no,user_type,device_token,profile_picture } = req.body;
        if(pan_no!=""||pan_no!=undefined){

            pan_data= CryptoJS.AES.encrypt(pan_no, process.env.secretKey).toString();
        }
        let checkemail = email.toLowerCase();
      
            const userEmail = await User.findOne({ email: checkemail, isDeleted: false }).exec();
            if (userEmail) return res.status(200).json({ title: 'User with this email id already exists', error: true, token: "", data: {} });
            const newUser = new User({
                email: checkemail,
                first_name,
                last_name,
                phone_number,
                device_list:device_token,
                pan_no :pan_data!=""?pan_data:"",
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                profile_picture:"dummy image url will be here",
                user_type: user_type,
                is_verified: true,
                is_company_registred: false
            })
            const savedUser = await newUser.save();


            const token =  jwt.sign({
                user_id: newUser._id,
                email: checkemail,
                name: first_name,
                phone_number: phone_number,
                user_type: user_type,
                is_verified: true
            }, process.env.jwt_secret,
                { expiresIn: "30d" },
            );
            res.status(200).json({
                title: 'User is save successfully.', error: false, token: token, data: {
                    _id: savedUser._id,
                    first_name: savedUser.first_name,
                    last_name: savedUser.last_name,
                    phone_number: savedUser.phone_number,
                    email: savedUser.email,
                    user_type: savedUser.user_type,
                    is_verified: savedUser.is_verified,
                    is_company_registred: savedUser.is_company_registred,
                    profile_picture:savedUser.profile_picture,
                },
            });
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({ title: "Something went wrong while saving admin account.", error: true, data: error });
    }
}







const userDetails = async (req, res) => {
    try {
        const result = validationResult(req);
        if (result.errors.length > 0) {
            return res.status(200).json({
                error: true,
                title: result.errors[0].msg,
                errors: result,
            });
        }

        const userDetails = await User.findById(req.body.id).exec();

        if (!userDetails) {
            return res.status(200).json({
                title: "User not found",
                error: true,
                userDetails: {}
            });
        }

        if (userDetails.isDeleted === true) {
            return res.status(200).json({
                title: "User you are searching for is deleted.",
                error: true,
                userDetails: {}
            });
        }
        let bytes  = CryptoJS.AES.decrypt(userDetails.pan_no, process.env.secretKey);
        userDetails.pan_no = bytes.toString(CryptoJS.enc.Utf8);

        return res.status(200).json({
            title: "Task fetched successfully",
            error: false,
            userDetails:  {
                _id: userDetails._id,
                first_name: userDetails.first_name,
                last_name: userDetails.last_name,
                phone_number: userDetails.phone_number,
                email: userDetails.email,
                user_type: userDetails.user_type,
                pan_no:userDetails.pan_no,
                is_verified: userDetails.is_verified,
                profile_picture:userDetails.profile_picture,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ title: "Something went wrong", error: true, data: error });
    }
};

const login = async (req, res) => {
    try {
        const {email, password } = req.body;
        const foundUser = await User.findOne({ email:email }).exec();
        if (!foundUser) {
            return res.status(200).json({
                title: "User not found",
                error: true,
            });
        }
        if (foundUser.is_verified!==true) {
            return res.status(200).json({
                title: "User is not verified by our system.",
                error: true,
            });
        }
        const isAuthenticated = bcrypt.compareSync(password, foundUser.password);
        if (!isAuthenticated) {
            return res.status(200).json({
                title: "Please enter valid email id or password",
                error: true,
            });
        }
        const token =  jwt.sign({
            user_id: foundUser._id,
            first_name: foundUser.first_name,
            last_name: foundUser.last_name,
            user_type: foundUser.user_type,
        }, process.env.jwt_secret,
            {
                expiresIn: "30d",
            }
        );
        return res.status(200).json({
            title: "User login successful",
            error: false,
            token: token,
            userDetails:  {
                _id: foundUser._id,
                first_name: foundUser.first_name,
                last_name: foundUser.last_name,
                phone_number: foundUser.phone_number,
                email: foundUser.email,
                user_type: foundUser.user_type,
                pan_no:foundUser.pan_no,
                is_verified: foundUser.is_verified,
                profile_picture:foundUser.profile_picture,
            },
        });
    } catch (error) {
        return res.status(200).json({
            title: error.message || "Something went wrong",
            error: true,
        });
    }
}




module.exports={
    registerAdmin,
    userDetails,
    login
}