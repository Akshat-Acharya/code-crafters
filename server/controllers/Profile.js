const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    //get data

    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    //get user id
    const id = req.user.id;

    //validationn

    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //find prfile

    const userDetails = await User.findById(id);
    const profileID = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileID);

    //update

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;
    await profileDetails.save();
    //return
    return res.status(200).json({
      success: true,
      message: "Profile details successfully",
      profileDetails,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something wnt wrong",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetail = await User.findById({_id:id});
    if (!userDetail) {
      return res.status(400).json({
        success: false,
        message: "User not found ",
      });
    }
    await Profile.findByIdAndDelete({ _id: userDetail.additionalDetails });
    await User.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something wnt wrong",
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
