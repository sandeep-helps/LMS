import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { FaArrowLeftLong, FaStar } from "react-icons/fa6";
import { FaLock, FaPlayCircle } from "react-icons/fa";
import img from "../assets/empty.jpg";
import Card from "../components/Card.jsx";
import { setSelectedCourseData } from "../redux/courseSlice";
import { toast } from "react-toastify";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData, selectedCourseData } = useSelector(
    (state) => state.course
  );
  const { userData } = useSelector((state) => state.user);

  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  /* -------------------- AVG RATING -------------------- */
  const avgRating = useMemo(() => {
    const reviews = selectedCourseData?.reviews || [];
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [selectedCourseData]);

  /* -------------------- LOAD COURSE -------------------- */
  useEffect(() => {
    if (!courseData?.length) return;

    const course = courseData.find((c) => c._id === courseId);
    if (course) {
      dispatch(setSelectedCourseData(course));
    }
  }, [courseId, courseData, dispatch]);

  /* -------------------- CHECK ENROLLMENT -------------------- */
  useEffect(() => {
    if (!userData?.enrolledCourses || !courseId) return;

    const enrolled = userData.enrolledCourses.some((c) => {
      const id = typeof c === "string" ? c : c._id;
      return id === courseId;
    });

    setIsEnrolled(enrolled);
  }, [userData, courseId]);

  /* -------------------- FETCH CREATOR -------------------- */
  useEffect(() => {
    const fetchCreator = async () => {
      if (!selectedCourseData?.creator) return;
      try {
        const res = await axios.post(
          `${serverUrl}/api/course/getcreator`,
          { userId: selectedCourseData.creator },
          { withCredentials: true }
        );
        setCreatorData(res.data);
      } catch (err) {
        console.error("Creator fetch error:", err);
      }
    };
    fetchCreator();
  }, [selectedCourseData]);

  /* -------------------- CREATOR COURSES -------------------- */
  useEffect(() => {
    if (!creatorData?._id || !courseData?.length) return;

    const list = courseData.filter(
      (c) => c.creator === creatorData._id && c._id !== courseId
    );
    setSelectedCreatorCourse(list);
  }, [creatorData, courseData, courseId]);

  /* -------------------- REVIEW -------------------- */
  const handleReview = async () => {
    if (!rating || !comment.trim()) {
      toast.error("Please add rating and comment");
      return;
    }

    try {
      await axios.post(
        `${serverUrl}/api/review/givereview`,
        { rating, comment, courseId },
        { withCredentials: true }
      );
      toast.success("Review added");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Review failed");
    }
  };

  /* -------------------- ENROLL -------------------- */
  const handleEnroll = async () => {
    if (!userData?._id) {
      toast.error("Please login to enroll");
      navigate("/login");
      return;
    }

    try {
      const orderRes = await axios.post(
        `${serverUrl}/api/payment/create-order`,
        { courseId },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderRes.data.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: "Course Enrollment",
        order_id: orderRes.data.id,

        handler: async (response) => {
          if (!response?.razorpay_order_id) {
            toast.error("Payment cancelled");
            return;
          }

          try {
            const verifyRes = await axios.post(
              `${serverUrl}/api/payment/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                courseId,
                userId: userData._id,
              },
              { withCredentials: true }
            );

            toast.success(verifyRes.data.message);
            setIsEnrolled(true);
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Payment verification failed"
            );
          }
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <FaArrowLeftLong
              className="cursor-pointer mb-2"
              onClick={() => navigate("/")}
            />
            <img
              src={selectedCourseData?.thumbnail || img}
              alt="course"
              className="rounded-xl w-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-3">
            <h1 className="text-2xl font-bold">
              {selectedCourseData?.title}
            </h1>
            <p className="text-gray-600">
              {selectedCourseData?.subTitle}
            </p>

            <div className="text-yellow-500">⭐ {avgRating}</div>

            <div className="text-lg font-semibold">
              ₹{selectedCourseData?.price}
            </div>

            {!isEnrolled ? (
              <button
                className="bg-black text-white px-6 py-2 rounded"
                onClick={handleEnroll}
              >
                Enroll Now
              </button>
            ) : (
              <button
                className="bg-green-200 text-green-700 px-6 py-2 rounded"
                onClick={() => navigate(`/viewlecture/${courseId}`)}
              >
                Watch Now
              </button>
            )}
          </div>
        </div>

        {/* CURRICULUM */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/5 p-6 rounded-xl border">
            <h2 className="font-bold mb-3">Course Curriculum</h2>
            {selectedCourseData?.lectures?.map((lec) => (
              <button
                key={lec._id}
                disabled={!lec.isPreviewFree}
                onClick={() => lec.isPreviewFree && setSelectedLecture(lec)}
                className={`w-full flex gap-2 px-3 py-2 border rounded mb-2 ${
                  lec.isPreviewFree
                    ? "hover:bg-gray-100"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {lec.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
                {lec.lectureTitle}
              </button>
            ))}
          </div>

          <div className="md:w-3/5 p-6 rounded-xl border">
            <div className="aspect-video bg-black rounded flex items-center justify-center">
              {selectedLecture?.videoUrl ? (
                <video
                  src={selectedLecture.videoUrl}
                  controls
                  className="w-full h-full"
                />
              ) : (
                <span className="text-white">
                  Select a preview lecture
                </span>
              )}
            </div>
          </div>
        </div>

        {/* REVIEW */}
        <div>
          <h2 className="font-semibold mb-2">Write a Review</h2>
          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar
                key={s}
                className={s <= rating ? "text-yellow-500" : "text-gray-300"}
                onClick={() => setRating(s)}
              />
            ))}
          </div>
          <textarea
            className="w-full border p-2 rounded"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="bg-black text-white px-4 py-2 rounded mt-2"
            onClick={handleReview}
          >
            Submit Review
          </button>
        </div>

        {/* OTHER COURSES */}
        <div>
          <h2 className="font-semibold mb-3">
            Other courses by the educator
          </h2>
          <div className="flex flex-wrap gap-4">
            {selectedCreatorCourse.map((c) => (
              <Card
                key={c._id}
                thumbnail={c.thumbnail}
                title={c.title}
                id={c._id}
                price={c.price}
                category={c.category}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;
