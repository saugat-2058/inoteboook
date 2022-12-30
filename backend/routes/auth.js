// const { application } = require('express')
const express = require("express");
const User = require("../models/User");
const router = express.Router();
//bcrypt js installed and used
const bcrypt = require("bcryptjs");
//jwt token  installed and imported and used
var jwt = require('jsonwebtoken')
//importing  the validation fromthe express validaion buy  typing thee npm --save express-validaion in the terminal and importing it  for the validation uses in our app
const { body, validationResult } = require("express-validator");
const { json } = require("express");

const JWT_SECRET='saugatIdBad';

//create user  using he post api/auth
router.post(
  "/createUser",
  //creating  the validation for our data
  [
    body("email", "Enter a valid Email").isEmail(),
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Password must be of the 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // console.log(req.body);
    //alling the validationn 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //condition for  the encounter of the validation
      return res.status(400).json({ errors: errors.array() });
    }
    // const user = User(req.body);
    // user.save();

    //checking  the same emal is present in the  schema or not to ensure there must be the unique  email in  the  schema
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "Sorry auser with the same email already exists" });
    }
    //creating a new useer 
    const salt = await  bcrypt.genSalt(10);
    const secPass = await bcrypt.hash( req.body.password,salt)
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })     .catch((err) => {
        console.error(error.message);
        res.status(500).send("Some Error Occoured");
      });
    const data = {
        user:{
            id:user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET);
    //   console.log(authToken)
      res.json({authToken}) 
      //catching  the error 
 

   
    // res.json(user);
  }
);

//authicate auser 
router.post(
    "/login",
    //creating  the validation for our data
    [
      body("email", "Enter a valid Email").isEmail(),
      body("password","passwords cannot be blank").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //condition for  the encounter of the validation
          return res.status(400).json({ errors: errors.array() });
        }

        const {email,password}= req.body;
        try{
let user = await User.findOne({email})
if(!user){
    return res.status(400).json({error: "Please try to login with correct credentials"})
}
const passwordCompare = await bcrypt.compare(password,user.password)
if(!passwordCompare){
    return res.status(400).json({error: "Please try to login with correct credentials"})
}
const data = {  
    user:{

        id : user.id
    }
}
const authToken = jwt.sign(data,JWT_SECRET);
res.json({authToken})
        }catch{
            console.error(errors.message);
            res.status(500).send("Some Error Occoured");

        }
    })

module.exports = router;
