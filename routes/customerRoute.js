import express from 'express';
const router= express.Router();



import { getRegister,getHome,getGuestUserHome,getLogin,resendOTP,getSunglasses, getVerifyMail,getSendOTP,getLogout, getHomeProductDetails, getForgotPassword, getResetPassword,getReset, 
    postForgotPassword, postResetPassword, getEyeglasses, getMenSunglasses, 
    getWomenSunglasses, getKidsSunglasses, getuserProfile,postAddtoCart, getUserProfileAddress,
    postUserProfileAddress ,getUpdatedUserProfileAddress, getEditUserProfileAddress, getAddtoCart} from '../controllers/customerController.js';
import { loginController, user_registration, register_User} from '../controllers/authController.js';
import { registerValidator } from '../controllers/authController.js';
import { sendOTP, verifyMail , verify_Otp} from '../helpers/mailer.js';
import { requireAuth,checkUserLoggedIn, checkUserNotLoggedIn,checkBlockedUser,is_Admin, checkUserLogout} from '../middleware/auth.js';



import { otpValidator } from '../helpers/validation.js';
import userOtp from '../models/userOtp.js';
import { preventCache } from '../middleware/auth.js';

//rendering the first user guest home page
router.get('/',getGuestUserHome);
router.use(preventCache);
//home route

router.get('/home',requireAuth,checkBlockedUser,getHome);

router.get('/user-profile',getuserProfile);

router.get('/user-profile-address/:id',getUserProfileAddress);

router.post('/user-profile-address/:id',postUserProfileAddress);

router.get('/updated-user-profile-address',getUpdatedUserProfileAddress);

router.get('/edit-user-profile-address/:id',getEditUserProfileAddress);

router.get('/sunglasses',getSunglasses);

router.get('/eyeglasses',getEyeglasses);

router.get('/men-sunglasses',getMenSunglasses);

router.get('/women-sunglasses',getWomenSunglasses);

router.get('/kids-sunglasses',getKidsSunglasses);

//getiing product details when clicked
router.get('/home-product-details/:id',checkBlockedUser,getHomeProductDetails);

//register route
//router.route('/register').get(requireAuth,getRegister).post( registerValidator,registerController);
router.route('/register').get(getRegister).post(register_User,verify_Otp,user_registration);
//login route
router.get('/login',getLogin);


//post login route
router.post('/login',loginController);

//to get verify email
router.get('/email-verification',requireAuth,verifyMail,getVerifyMail)

//to send and get  otp
//router.route('/send-otp').get(requireAuth,getSendOTP).post(requireAuth,verifyOtp);
//router.route('/sent-otp').get(requireAuth,getSendOTP).post(verify_Otp,user_registration);
router.get('/send-otp',requireAuth,getSendOTP);
router.post('/send-otp',verify_Otp,user_registration);
//to resend otp
router.get('/resend-otp',requireAuth,resendOTP);
router.post('/resend-otp',verify_Otp,user_registration);

//forgot-password
router.get('/forgot-password',getForgotPassword);
router.post('/forgot-password',postForgotPassword);

//reset-password
router.get('/reset-password',getReset);
router.get('/reset-password/:resetToken',getResetPassword);
router.post('/reset-password/:resetToken',postResetPassword);

//cart
router.get('/addtocart/:id',requireAuth,getAddtoCart);
router.post('/addtocart/:id',postAddtoCart);

// to logout
router.get('/logout',getLogout);





export default router;
