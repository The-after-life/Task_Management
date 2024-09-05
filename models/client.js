const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    client_name: {
        type: String,
        required: true
    },
    device_list: [String],
    industry: {
        type: String,
        required: true,
    },
    contact_information: {
        email: {
            type: String,
            required: true,
            unique:true
        },
        phone_number: {
            type: String,
            required: true,
            unique:true
        },
    },
    address: String, // Optional
    users: [{
        _id: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'user'
        },
        first_name: String,
        last_name: String,
        user_type: String,
      }],
    //   number_of_users: {
    //     type: Number,
    //     required: [true, 'Number of employees is required'],
    //     min: [1, 'Number of employees must be at least 1']
    // },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const client = mongoose.model('client', clientSchema);
module.exports = client;
