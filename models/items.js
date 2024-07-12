import mongoose from 'mongoose';
import product from '../models/product.js';
import user from '../models/userModel.js';
import cart from '../models/cart.js';

const itemSchema = mongoose.Schema({
    itemid:{
        type:String,
        required:true,
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'products',
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
   
    
})

export default mongoose.model('items',itemSchema);