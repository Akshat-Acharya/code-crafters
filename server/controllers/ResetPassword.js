const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//reset Password
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email
    const email= req.body.email;

    //check user validation

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email not registered",
      });
    }

    //generate token

    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url

    const url = `http://localhost:3000/update-password/${token}`;

    //send mail containg the url
    await mailSender(
      email,
      "Password Reset Link",
      `Password rerset link : ${url}`
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Response send successfully pls change email",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Cannot rechange the password",
    });
  }
};

// reset password

exports.resetPassword = async (req, res) => {
  try {
    //data fetch

    const { password, confirmPassword, token } = req.body;

    // validation

    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password not matching",
      });
    }

    //get user details

    const userDetails = await User.findOne({ token: token });

    //if not found invalid token
    if (!userDetails) {
      return res.status(403).json({
        success: false,
        message: "User details not found in the db",
      });
    }

    // token time checkk

    if (userDetails.resetPasswordExpires > Date.now()) {
      return res.status(403).json({
        success: false,
        message: "Token is expired",
      });
    }

    // hash pwd
    const hashedPassword = await bcrypt.hash(password, 10);

    //password update

    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
      },
      { new: true }
    );
    return res.status(400).json({
        success : true,
        message : "Password change successfully"
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json({
        success : false,
        message : e.message
    })
  }
};
