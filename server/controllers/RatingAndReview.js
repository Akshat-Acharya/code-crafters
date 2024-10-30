const RatingAndReviewe = require("../models/RatingAndReview");
const Course = require("../models/Courses");
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;
    //fetchdata from body
    const { rating, review, courseId } = req.body;
    //validation if enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "User is not enrolled in this course",
      });
    }
    //check if already done or not
    const alreadyReviewd = await RatingAndReviewe.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewd) {
      return res.status(403).json({
        success: false,
        message: "Course is already reivewd by the student",
      });
    }
    //create rating and review
    const ratingReview = await RatingAndReviewe.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });
    //update course with this rating and review
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );
    console.log(updatedCourseDetails);
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      ratingReview,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
//getAverageRating

exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    const courseId = req.body.courseId;
    //calculate average rating
    const result = await RatingAndReviewe.aggregate([
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
    const allReviews = await RatingAndReviewe.find({})
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
