const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const misReportSchema = new Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'client',
        required: true,
    },
    report_data: {
        success_count: {
            type: Number,
            default: 0,
        },
        error_count: {
            type: Number,
            default: 0,
        },
        details: [
            {
                operation: String,
                status: String,
                timestamp: Date,
            }
        ],
    },
    generated_at: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true
});

const MISReport = mongoose.model('MISReport', misReportSchema);
module.exports = MISReport;
