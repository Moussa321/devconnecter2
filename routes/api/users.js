const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load input validation

const validateRegisterInput = require('../../validation/register');
const validateLoginInput =  require('../../validation/login')

const User = require("../../models/User");

router.get("/test", (req, res) => res.json({ msg: "Users works" }));

router.post("/register", (req, res) => {
  
  const {errors, isValid} = validateRegisterInput(req,body); 

  //check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((User) => {
    if (User) {
      errors.email = 'Email already exists';  
      return res.status(400).json({ email: "email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      const Newuser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(Newuser.password, salt, (err, hash) => {
          if (err) throw err;
          Newuser.password = hash;
          Newuser.save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route GET api/users/login
// @desc Login user/ Returning JWT Token
// @access Public

router.post('/login', (req, res) =>{

  const {errors, isValid} = validateLoginInput(req,body); 

  //check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password; 

  // find user by email

  User.findOne({email})
  .then(user => {
    //check for user

    if(!user){
      errors.email = 'User not found';
      return res.status(404).json(errors)
    }

    //check password

    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch){
        //User Matched

        const payload = { id: user.id, name: user.name, avatar: user.avatar} //create jwt payload

        //sign token

        jwt.sign(
          payload, 
          keys.secretOrKey, 
          {expiresIn: 3600}, 
          (err, token) => {
            res.json({
              success: true, 
              token: 'Bearer' + token
            });
           
          
        });
      } else {
        errors.password = 'Password Incorrect';
        return res.status(400).json(errors);
      }
    })
  }); 
});

// @route Get api/users/current
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({

    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});
module.exports = router;
