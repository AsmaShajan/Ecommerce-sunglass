import express from 'express';

import Users from '../models/userModel.js';
import customerRoute from '../routes/customerRoute.js';
import { sendOTP, verifyMail } from '../helpers/mailer.js';
import products from '../models/product.js';
import category from '../models/category.js';
import generateRandomToken from '../middleware/resetauth.js';
import { sendResetEmail } from '../middleware/resetauth.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import otps from '../models/userOtp.js';
import nodemailer from 'nodemailer';
import { cropImageMiddleware } from '../middleware/cropImage.js';
import Category from '../models/category.js';
import {City} from 'country-state-city';
import { State } from 'country-state-city';
import Address from '../models/address_model.js';
import Cart from '../models/cart.js';
import Item from '../models/items.js';
import mongoose from 'mongoose';




export const getRegister = (req,res)=>{
    res.render('customer/auth/register');
}

export const getGuestUserHome = async (req,res)=>{
    try {
        const productList = await products.find({isBlocked:true});
        res.render('guestuserhome',{productList});
        
    } catch (error) {
        
    }
    
}

export const getHome = async (req,res)=>{
    try { 
       console.log(req.session.LoggedIn);
       
        //const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
        const userRegistered = req.user ? true : false;
        
        const productList = await products.find({isBlocked:true});

        res.render('home',{productList,userRegistered});
        
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
        
    }
    
}

export const getuserProfile = async(req,res)=>{
    try {
        
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
        const userId = req.session.userId;
       // console.log(userId);
        const user_Info = await Users.findById(userId);
        
        res.render('user-profile',{userRegistered,user_Info});

    } catch (error) {
        console.log(error);
    }
}

export const getUserProfileAddress = async(req,res)=>{
    try {
        
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;

        const userId = req.params.id;
         const user_Info = await Users.findById(req.params.id);
         //console.log(user_Info);
        //get all states of country
        const states = State.getStatesOfCountry('IN');
        
       // const selectedStateIsoCode = req.body.stateIsoCode;
        //console.log(req.body.stateIsoCode);
       
        
       // res.json({ cities: cities });

        res.render('user-profile-address', {userRegistered,states,user_Info});

    } catch (error) {
       console.log(error); 
    }
}

export const getUpdatedUserProfileAddress = async(req,res)=>{
    const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
    const user_Info = await Address.find({});
   
    res.render('updated-user-profile-address',{userRegistered,user_Info});
}

export const postUserProfileAddress = async(req,res)=>{
    try {

        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
        let userId = req.params.id;
        const {street,country,state,city,postalcode,default: isDefault} = req.body;
         
        if(!street || !country || !state || !city || !postalcode){
            res.send('All fields are required');    
        }

         // If the new address is set as default, unset the previous default addresses
         if (isDefault) {
            await Address.updateMany({ user: userId, default: true }, { $set: { default: false } });
        }
        
        const newAddress = new Address({street,country,state,city,postalcode});
        await newAddress.save();

        //find the particular userid and updating the address

        const user_Info = await Users.findById(userId);
        user_Info.addresses.push(newAddress._id);
        await user_Info.save();

      // Populate the addresses field
      const user_Informatn= await Users.findById(userId).populate('addresses');

        res.render('updated-user-profile-address',{userRegistered,user_Informatn})

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error");
        
    }
}

export const getEditUserProfileAddress = async(req,res)=>{

    const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
    const userId = req.params.id;
    const user_Info = await Users.findById(req.params.id);
    const states = State.getStatesOfCountry('IN');

    res.render('user-profile-address',{userRegistered, user_Info,states});

}
export const getSunglasses = async(req,res)=>{
    try{
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
        const productList = await products.find({isBlocked:true});
        res.render('sunglasses',{productList, userRegistered});
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getEyeglasses = async(req,res)=>{
    try {
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
        const productList = await products.find({isBlocked:true});
        res.render('eyeglasses',{productList, userRegistered});
        
    } catch (error) {
        console.log(error);
    }
}

export const getMenSunglasses = async(req,res)=>{
    try {
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;

        const searchCategory = await Category.findOne({title:'Men'});

        if(!searchCategory){
            return res.status(404).send('Category not found');
        }
        const productList = await products.find({isBlocked:true,category: searchCategory._id }).populate('category');
        res.render('men-sunglasses',{productList, userRegistered});
        
    } catch (error) {
        console.log(error);
    }
}

export const getWomenSunglasses = async(req,res)=>{
    try {
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;

        const searchCategory = await Category.findOne({title:'Women'});

        if(!searchCategory){
            return res.status(404).send('Category not found');
        }
        const productList = await products.find({isBlocked:true,category: searchCategory._id }).populate('category');
        res.render('women-sunglasses',{productList, userRegistered});
        
    } catch (error) {
        console.log(error);
    }
}

export const getKidsSunglasses = async(req,res)=>{
    try {
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;

        const searchCategory = await Category.findOne({title:'Kids'});

        if(!searchCategory){
            return res.status(404).send('Category not found');
        }
        const productList = await products.find({isBlocked:true,category: searchCategory._id }).populate('category');
        res.render('kids-sunglasses',{productList, userRegistered});
        
    } catch (error) {
        console.log(error);
    }
}
export const getHomeProductDetails = async(req,res)=>{
   
    try {

     //if(req.session.user_Email) 
     // {
    const productId = req.params.id;
    const userId = req.session.userId;
    const productList = await products.findById(productId);
    console.log(productList)

    const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
    let cart = await Cart.findOne({ userid: userId, status: 'active' });
    if (!productList) {
     
      return res.status(404).send('Product not found');
   }
   if (!cart) {
    cart = { totalitems: 0, items: [] };
}

      res.render('home-product-details',{ productList, userRegistered,cart});

    //}
 }catch (error) {
        
       // res.status(500).send('Internal Server Error');
       res.render('customer/auth/login');
    }
}

export const getLogin =(req,res)=>{
   
     res.render('customer/auth/login',{successmessage:''});
}

export const getVerifyMail = (req,res)=>{
    res.render('customer/auth/email-verification');
}

export const getSendOTP = (req,res)=>{
    //res.render('customer/auth/send-otp',{message})
    res.render('customer/auth/send-otp')
}


export const getLogout1 = async(req, res) => {
    res.clearCookie('jwt');// for clearing the cookie while logout..
   // req.session.logout = true;
    //delete req.session.loggedIn;
   // delete req.session.userLoggedIn;
    res.redirect('/');
    
};

export const getLogout = async (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    req.session.destroy(err => { // Destroy the session
      if (err) {
        console.error(err);
        return res.redirect('/'); // Redirect to home page even if session destruction fails
      }
  
      res.redirect('/');
    });
  };

export const resendOTP = async (req,res) => {
    try {
       const user_email = req.session.userEmail;
        console.log(user_email);
        //user_id = req.session.userid;
        // Call the sendOTP function to resend OTP
        const generated_OTP = await sendOTP(user_email);
        res.render('customer/auth/resend-otp');
    } catch (error) {
        console.log(error.message);
    }
}




export const getForgotPassword = (req,res)=>{
    res.render('customer/auth/forgot-password');
}

export const postForgotPassword = async (req,res)=>{
    try{
        const { email } = req.body;
        // Find user by email
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).send('Email not found');
        }
        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        // Set token expiration time to 1 hour from now
        const resetTokenExpires = Date.now() + 3600000; // 1 hour in milliseconds
        
        console.log(resetToken);
        
        // Save reset token and expiration time to user document
        user.resetPasswordToken = resetToken;
      
        user.resetPasswordExpires = resetTokenExpires;
        
        await user.save();

        
        
        
        // Send email with reset link containing token
        sendResetEmail(req.body.email,resetToken);


        // Replace this with your email sending logic
        res.send('Password reset link send to the mail');


        

    } catch (error) {
       
    
        res.status(500).send('Error in resetting password');
        
    }
}

export const getReset = async (req,res)=>{
    res.render('customer/auth/reset-password');
}

export const getResetPassword = async (req,res)=>{
   try {
    const { resetToken } = req.params;
        // Find user by reset token and check if token is valid and not expired
        const user = await Users.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }
        // Render reset password form with token as hidden input
        res.render('customer/auth/reset-password', { resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in resetting password');
    }
}

export const postResetPassword = async(req,res)=>{
    try {
        const { resetToken } = req.params;
        const { newPassword } = req.body;
        

        // Find user by reset token and check if token is valid and not expired
        const user = await Users.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(404).send('Invalid or expired token');
        }
        // Hash new password and update user document
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        // Clear reset token and expiration time
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        //res.send('Password reset successfully');
        res.render('customer/auth/login',{successmessage: 'Passsword reset successfully'})
    } catch (error) {
        console.error(error);
        res.status(500).send('Error in resetting password');
    }
}

export const getAddtoCart = async(req,res)=>{
    try {
        
        const userId = req.session.userId;
        const productId = req.params.id;
        const cart = await Cart.findOne({ userId });
        const userRegistered = (req.session.userLoggedIn||req.session.loggedIn) ? true : false;
        const productList = await products.findById(productId);
        if (cart && cart.items.length > 0) {
          //res.status(200).send(cart);
          res.render('home-product-details',{userRegistered,productList,cart});
        } else {
          res.send(null);
        }
    } catch (error) {
        
    }
}

const calculateTotalQuantity = async (cartId) => {
    try {
        const cart = await Cart.findById(cartId).populate('items');
        if (!cart) {
            return 0; // Or handle as per your logic
        }
        let totalQuantity = 0;
        cart.items.forEach(item => {
            totalQuantity += item.quantity;
        });
        return totalQuantity;
    } catch (error) {
        console.error('Error calculating total quantity:', error);
        return 0; // Or handle as per your error handling logic
    }
};


//Add to Cart

export const postAddtoCart = async (req, res) => {
    const productId = req.params.id;
    const userId = req.session.userId;
    const quantity = req.body.quantity;
    console.log(quantity);
    const userRegistered = (req.session.userLoggedIn || req.session.loggedIn) ? true : false;

    try {
        const product = await products.findById(productId);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userid: userId }).populate('items');

        if (cart) {
            req.session.cartId = cart._id;
            const existingCartItem = cart.items.find(item => item.productId.equals(product._id));

            if (existingCartItem) {
                existingCartItem.quantity += quantity;
                await existingCartItem.save();
            } else {
                const newItem = new Item({
                    itemid: productId,
                    productId: product._id,
                    quantity,
                    price: product.price,
                   
                });
                await newItem.save();
                cart.items.push(newItem);
            }

            cart.bill = cart.items.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
            await cart.save();
        } else {
            const newItem = new Item({
                itemid: productId,
                productId: product._id,
                quantity,
                price: product.price,
               
            });
            await newItem.save();

            cart = new Cart({
                userid: userId, 
                items: [newItem],
                bill: quantity * product.price,
                status: 'active'
            });

            await cart.save();
            req.session.cartId = cart._id;
        }

        const totalItems = await calculateTotalQuantity(cart._id);

        res.render('home-product-details', { userRegistered, item: product, cart, totalItems });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

