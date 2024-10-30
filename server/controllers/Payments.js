const { instance } = require("../config/razorpay");
const Course = require("../models/Courses");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/template/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment
exports.capturePayment = async (req, res) => {
  const { course_id } = req.body;
  const userId = req.user.id;
  if (!course_id) {
    return res.status(402).json({
      success: false,
      message: "Please provide valid course id",
    });
  }

  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.status(401).json({
        success: false,
        message: "Could not find the course",
      });
    }
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "something wnt wrong",
    });
  }
  const amount = course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: course_id,
      userId,
    },
  };
  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);
    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.creteHmac("sha256", webhookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (signature === digest) {
    console.log("PAyment is authorized");

    const { courseId, userId } = req.body.playload.payment.entity.notes;

    try {
      const enrollCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrollCourse) {
        return res.status(402).json({
          success: false,
          message: "Student dint enroll",
        });
      }
      console.log(enrollCourse);
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      console.log(enrolledStudent);

      const emailResponse = await mailSender(
        enrolledStudent.email,
        "Congratulations",
        "you are onboarded into new Course"
      );
      return res.status(200).json({
        success: true,
        message: "Student enrolled in course with mail sent",
      });
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: e.message,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      messgae: "could not find the course",
    });
  }
};
