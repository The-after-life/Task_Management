const Clients = require("../models/client");
const { validationResult } = require("express-validator");




const createClient = async (req, res) => {
    try {

            const result = validationResult(req);
            if (result.errors.length > 0) {
                return res.status(200).json({
                    error: true,
                    title: result.errors[0].msg,
                    errors: result,
                });
            }
    
        const { client_name, industry, contact_information, additional_info,device_token } = req.body;


        const client_email = await Clients.findOne({ "contact_information.email": contact_information.email, isDeleted: false }).exec();
        const client_phone = await Clients.findOne({ "contact_information.phone_number": contact_information.phone_number, isDeleted: false }).exec();
       
        if (client_email)return res.status(200).json({ title: 'User with this email id already exists', error: true, data: {} });
        
        if (client_phone) return res.status(200).json({ title: 'User with this phone number already exists', error: true, data: {} });



        const newClient = new Clients({
            client_name: client_name,
            industry:industry,
            "contact_information.phone_number":contact_information.phone_number,
            "contact_information.email":contact_information.email,
            device_list:device_token||"", // it we can use for push notifications to user
            profile_picture:"will store image url wherever we upload that image like S3 in AWS.",
            additional_info:additional_info,
            is_verified: true,
        })
        const savedUser = await newClient.save();
        return res.status(200).json({
            title: "Client created successfully",
            error: false,
            data: savedUser
        });
    } catch (error) {
        return res.status(500).json({ title: "Internal Server Error", error: true, error_message: error.message });
    }
};

const editClient =(req,res)=>{

}

const deleteClient =(req,res)=>{
    
}
const listClients =(req,res)=>{
    
}

module.exports = {
    createClient,
    editClient,
    deleteClient,
    listClients
}