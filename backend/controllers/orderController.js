import Course from "../models/courseModel.js";
import Razorpay from "razorpay";
import User from "../models/userModel.js";
export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!course.price || isNaN(Number(course.price))) {
      return res.status(400).json({
        message: "Course price is missing or invalid",
      });
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      return res.status(500).json({
        message: "Razorpay keys missing in environment variables",
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Number(course.price) * 100, // MUST be number
      currency: "INR",
      receipt: courseId.toString(),
    });

    return res.status(200).json(order);
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, courseId, userId } = req.body;

    if (!razorpay_order_id || !courseId || !userId) {
  console.log("Verify payment payload:", req.body);
  return res.status(400).json({
    message: "Missing required payment fields",
  });
}



    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const orderInfo = await razorpay.orders.fetch(razorpay_order_id);

    // For learning/demo purpose
    if (orderInfo.status === "created") {
      const user = await User.findById(userId);
      const course = await Course.findById(courseId);

      if (!user || !course) {
        return res.status(404).json({ message: "User or Course not found" });
      }

      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        await course.save();
      }

      return res.status(200).json({
        message: "Payment verified & enrollment successful",
      });
    }

    return res.status(400).json({ message: "Payment verification failed" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error during verification" });
  }
};

