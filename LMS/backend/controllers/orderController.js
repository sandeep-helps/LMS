import Course from "../models/courseModel.js";
import Razorpay from "razorpay";
import User from "../models/userModel.js";

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        message: "Razorpay keys are missing in environment variables",
      });
    }

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET, // ✅ FIXED
    });

    const course = await Course.findById(courseId);
    if (!course)
      return res.status(404).json({ message: "Course not found" });

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: courseId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: `Order creation failed: ${err.message}` });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, courseId, userId } = req.body;

    const razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET, // ✅ FIXED
    });

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const user = await User.findById(userId);
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      const course = await Course.findById(courseId);
      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res
        .status(200)
        .json({ message: "Payment verified and enrollment successful" });
    } else {
      return res
        .status(400)
        .json({ message: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error during payment verification" });
  }
};
