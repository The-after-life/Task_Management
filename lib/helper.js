const async = require('async');
const moment = require('moment');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const ejs = require("ejs");
const fs = require('fs');
let path = require('path');
const mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;
let request = require("request");













const validate_pan = async function (mobile, pan_no) {
    try {
        const response = await axios({
            method: 'post',
            url: `https://mvp.verify24x7.in/verifyApi/api/validate-pan`,
            headers: { 'Content-Type': 'application/json' },
            body:{pan:pan_no}
        });
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error);
        return null;
    }
  };