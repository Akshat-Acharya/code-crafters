const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bycrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// send otp

exports.sendotp = async (req, res) => {
  try {
    // fetch email
    const { email } = req.body;
    //check user already exist
    const checkUserPresent = await User.findOne({ email });
    // if user exist return response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exist",
      });
    }
    // generate otp

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("otp generated  ", otp);
    const result = await OTP.findOne({ otp: otp });
    //check unique otp or not
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    //create an entry in db
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    res.status(200).json({
      success: true,
      message: "otp sent successfully",
      otp,
    });
  } catch (e) {
    console.log("Error while sending otp : ", e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

//sign up

exports.signup = async (req, res) => {
  try {
    // data fetch from req ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validatiion
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Something is missing",
      });
    }
    // password checking
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords are not same",
      });
    }
    //checking user already exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    //finding otp
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("recent otp ", recentOtp);
    //validate OTP
    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP length is zero",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Otp is incorrect",
      });
    }
    // Hashing password
    const hashedPassword = await bycrypt.hash(password, 10);
    // create entry in db

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    //return response
    return res.status(200).json({
      success: true,
      message: "Entry created successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// Login flow

exports.login = async (req, res) => {
  try {
    //get data

    const { email, password } = req.body;

    //validation

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required to be filled",
      });
    }

    //user check

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    //token genrate,after password matching

    if (await bycrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response

      const options = {
        expires: new Date(Date.now() + 3 * 34 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in ",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Login failure pls try again",
    });
  }
};

//change password

exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bycrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bycrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}