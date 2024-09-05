const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin'],
        default: 'admin',
    },
    is_active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true
});

const admin = mongoose.model('admin', adminSchema);
module.exports = admin;
