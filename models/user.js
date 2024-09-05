const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true,
    },
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
    phone_number: {
        type: String,
        required: true,
        unique: true,
    },
    user_type: {
        type: String,
        enum: ['admin', 'client_user'],
        default: 'client_user',
    },
    profile_picture: String,
    is_active: {
        type: Boolean,
        default: false,
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const user = mongoose.model('user', userSchema);
module.exports = user;
