import mongoose from 'mongoose';
import products from '../models/product.js';
import user from '../models/userModel.js';
import items from '../models/items.js';

//cart Schema

const cartSchema = mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userModel',
        required:true, 
        trim:true
    },
    items: [{
         
         type: mongoose.Schema.Types.ObjectId,
         ref: 'items',
         required: true
      
         
       }],
      bill: {
          type: Number,
          required: true,
         default: 0
        },
    status:{
        type:String,
        enum:['active','ordered','abandoned'],
        default:'active'
    }

},{timestamps:true});

export default mongoose.model('cart',cartSchema);