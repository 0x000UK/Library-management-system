import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

/* User Registration */
router.post("/register", async (req, res) => {
  try {
    /* Salting and Hashing the Password */
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    /* Create a new user */
    const newuser = await new User({
      userType: req.body.userType,
      userFullName: req.body.userFullName,
      admissionId: req.body.admissionId,
      employeeId: req.body.employeeId,
      age: req.body.age,
      dob: req.body.dob,
      gender: req.body.gender,
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      email: req.body.email,
      password: hashedPass,
      isAdmin: req.body.isAdmin,
    });

    /* Save User and Return */
    const user = await newuser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  try {
    // Find user by admissionId or employeeId
    const user = req.body.admissionId
      ? await User.findOne({ admissionId: req.body.admissionId })
      : await User.findOne({ employeeId: req.body.employeeId });

    if (!user) {
      console.log('User Not Found');
      return res.status(404).json("User not found");
    }

    // Validate password
    // const validPass = await bcrypt.compare(req.body.password, user.password);
    
    // if (!validPass) {
    //   console.log('Password did not match');
    //   return res.status(400).json("Wrong password");
    // }

    // If everything is correct, send the user data as the response
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error"); // If an error occurs, send a 500 response
  }
});


export default router;
