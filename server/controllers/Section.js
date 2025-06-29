const Section = require("../models/Section");
const Course = require("../models/Courses");


exports.createSection = async (req, res) => {
  try {
    // Extract the required properties from the request body
    const { sectionName, courseId } = req.body

    // Validate the input
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required properties",
      })
    }

    // Create a new section with the given name
    const newSection = await Section.create({ sectionName })

    // Add the new section to the course's content array
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    // Return the updated course object in the response
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    })
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

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
