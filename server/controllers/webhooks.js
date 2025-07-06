import { Webhook } from "svix";
import User from "../models/User.js";

// API controller to manage clerk user with DB
export const clerkWebhooks = async(req, res) => {
    try{
        // Check if required environment variable exists
        if (!process.env.CLERK_WEBHOOK_SECRET) {
            console.error('CLERK_WEBHOOK_SECRET not found in environment');
            return res.status(500).json({success: false, message: 'Webhook secret not configured'});
        }

        // Prepare the body for svix verification
        const body = req.body;
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        // Validate headers
        if (!headers['svix-id'] || !headers['svix-timestamp'] || !headers['svix-signature']) {
            console.error('Missing svix headers');
            return res.status(400).json({success: false, message: 'Missing required svix headers'});
        }

        // Create svix instance with clerk webhook secret
        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        let evt;
        try {
            evt = wh.verify(body, headers);
        } catch (err) {
            console.error('Webhook verification failed:', err.message);
            return res.status(400).json({success: false, message: 'Webhook verification failed'});
        }

        // Switch case for different webhook events
        const { data, type } = evt;
        
        switch (type) {
            case "user.created":{
             // Validate required data
             if (!data.id || !data.email_addresses?.[0]?.email_address) {
                 console.error('Missing required user data');
                 return res.status(400).json({success: false, message: 'Missing required user data'});
             }
             
             const userData = {
                _id: data.id,
                email: data.email_addresses[0].email_address,
                name: (data.first_name || '') + ' ' + (data.last_name || ''),
                image: data.image_url || '',
                resume: ''
             }
             
             try {
                 await User.create(userData);
                 return res.json({success: true, message: 'User created successfully'});
             } catch (dbError) {
                 console.error('Database error creating user:', dbError);
                 return res.status(500).json({success: false, message: 'Database error'});
             }
             break;
            }
            case "user.updated":{
             const userData = {
                email: data.email_addresses[0].email_address,
                name: (data.first_name || '') + ' ' + (data.last_name || ''),
                image: data.image_url || '',
             }
             
             try {
                 await User.findByIdAndUpdate(data.id, userData);
                 return res.json({success: true, message: 'User updated successfully'});
             } catch (dbError) {
                 console.error('Database error updating user:', dbError);
                 return res.status(500).json({success: false, message: 'Database error'});
             }
             break;
            }            
             case "user.deleted":{
                try {
                    await User.findByIdAndDelete(data.id);
                    return res.json({success: true, message: 'User deleted successfully'});
                } catch (dbError) {
                    console.error('Database error deleting user:', dbError);
                    return res.status(500).json({success: false, message: 'Database error'});
                }
                break;
            }        
            default:
                return res.json({success: true, message: 'Event type not handled'});
                break;
        }
    }
    catch(error)
    {
        console.error('Webhook error:', error);
        res.status(500).json({success:false, message:'WebHooks Error'});
        
    }
}