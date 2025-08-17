const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Courses");
const { default: mongoose } = require("mongoose");


exports.createRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, review, courseId } = req.body;

    // Validation: Check if user is enrolled
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnroled: { $elemMatch: { $eq: userId } }, // CORRECTED
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "User is not enrolled in this course", 
      });
    }

    // Validation: Check if user has already reviewed
    const alreadyReviewed = await RatingAndReview.findOne({ // CORRECTED
      user: userId,
      course: courseId,
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the student",
      });
    }

    // Create the rating and review
    const ratingReview = await RatingAndReview.create({ // CORRECTED
      rating,
      review,
      course: courseId,
      user: userId,
    });

    // Update the course with the new rating
    await Course.findByIdAndUpdate(
      courseId, // Simplified this line
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({ // Changed to 201 for resource creation
      success: true,
      message: "Rating and review created successfully",
      data: ratingReview,
    });

  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the rating.",
    });
  }
};
//getAverageRating

exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseId;
    //calculate average rating
    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    //return rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    //if no review exist
    return res.status(200).json({
      success: true,
      message: "Average rating is zero",
      averageRating: 0,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
//getAllRatingsAndReviews

exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({ path: "user", select: "firstName lastName email image" })
      .populate({ path: "course", select: "courseName" })
      .exec();
    return res.status(200).json({
      success: true,
      message: "all reviews fetched successfully",
      data: allReviews,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
