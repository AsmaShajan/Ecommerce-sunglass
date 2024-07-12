import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    street:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true,
        default:'India'
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    postalcode:{
        type:String,
        required:true
    },
    default: { type: Boolean, default: false } // New field to indicate default address
});

export default mongoose.model('Address',addressSchema);