import jwt from 'jsonwebtoken';
import users from '../models/userModel.js';
import multer from 'multer';
import path from 'path';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/login');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      res.clearCookie('jwt');
      return res.redirect('/login');
    } else {
      req.user = decodedToken;
      req.userId = decodedToken.userId;
      console.log(req.userId);
      req.isAdmin = (decodedToken.role === 'admin');
      next();
    }
  });
};

export const preventCache = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
};

 
export const requireAuth3 = (req,res,next)=>{
  const token = req.cookies.jwt;
 console.log(token);
 console.log(req.session.loggedIn);

 // Check if user is logged in based on session or JWT token
 //if (!req.session.loggedIn && !token) {
  // If not logged in, redirect to login page
  //return res.redirect('/login');
//}

  if(token){
       jwt.verify(token, process.env.JWT_SECRET,(err,decodedToken)=>{
        if(err){
          //console.log(err);
          //res.redirect('/login');
          //res.status(401).json({ error: 'Authentication failed' });
          // If JWT token verification fails, clear the cookie and redirect to login page
          res.clearCookie('jwt');
          return res.redirect('/login');

        }else{
          console.log(decodedToken);

          // Valid token, extract userId and role from decoded token
          const { userId, role } = decodedToken;
          
          req.user = decodedToken;
          req.userId= decodedToken.userId;

          //next();

          if (role === 'admin') {
            // User is admin, grant access to admin side
            //res.redirect('/admin-dashboard');
            req.isAdmin = true; 

            next();
        } else {
            // User is not admin, grant access to user side
            //res.redirect('/home'); // Assuming '/home' is the route for user side
            next();
        }
        }
       })
  }
  else{
    res.redirect('/login');
  }
}
  

  
  
  export const auth_isAdmin = (role)=>{
     return (req,res,next)=>{
      console.log(req.user.role);
      if(req.user.role !==role){
       
        res.render('admin/admin_login')
      }
      next();
     }
  }

  
//to check if user is registered and  logged in
export const checkUserLoggedIn = async (req, res, next) => {
  console.log(req.session.loggedIn);
  try{
       if (!req.session.loggedIn) {
           return res.redirect('/login');
       }
       next();
  }
  catch(error){
       console.log(error);
  }
}

export const checkUserLogout = async(req,res,next)=>{
 try{
  console.log( req.session.logout);
  if(req.session.logout){
    res.render('customer/auth/login', {successmessage: ''});
  }
 }
catch(error){
  console.log(error);
}
}

export const checkUserNotLoggedIn = async(req,res,next)=>{
  console.log(req.session.loggedIn);
   try{
       if(req.session.loggedIn){
           return res.redirect('/');
       }
       return next()
   }catch(error){
       console.error(error)
   }
}

// to check if user is blocked
export const checkBlockedUser = async (req, res, next) => {
    try {
       
        const userId = req.session.userId; // Assuming you have user ID in the session
        const user = await users.findById(userId); // Assuming you have a User model

        // If user is blocked, deny access
        if (user && user.isBlocked) {
            return res.status(403).send('Access Denied: Your account is blocked.');
        }

        // If user is not blocked, proceed to next middleware or route handler
        next();
    } catch (error) {
        console.error('Error checking user status:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const is_Admin = (req,res,next)=>{
  console.log(req.session.admin);
  if(!req.session.admin){
    res.redirect('/customer/auth/login');
  }
  else{
    res.redirect('/admin/admin-dashboard');
  }
}