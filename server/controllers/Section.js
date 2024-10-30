const Section = require("../models/Section");
const Course = require("../models/Courses");

exports.createSection = async (req, res) => {
  try {
    //data fetch

    const { sectionName, courseId } = req.body;

    //data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing any one of them",
      });
    }

    //create section

    const newSection = await Section.create({ sectionName });

    //update the course with section objectId

    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Course section created successfully",
      updatedCourseDetails,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wronge",
      error: e.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //fetch data

    const { sectionName, sectionID } = req.body;

    //validate data
    if (!sectionName || !sectionID) {
      return res.status(400).json({
        success: false,
        message: "Missing any one of them",
      });
    }
    // update data

    const section = await Section.findByIdAndUpdate(
      sectionID,
      { sectionName },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: " section updated successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wronge",
      error: e.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionID } = req.body;
    await Section.findByIdAndDelete(sectionID);
    return res.status(200).json({
      success: true,
      message: " section deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Something went wronge",
      error: e.message,
    });
  }
};
