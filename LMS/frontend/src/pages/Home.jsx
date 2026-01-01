import React from "react";
import { useNavigate } from "react-router-dom";
import { SiViaplay } from "react-icons/si";

import Nav from "../components/Nav";
import Logos from "../components/Logos";
import Cardspage from "../components/Cardspage";
import ExploreCourses from "../components/ExploreCourses";
import About from "../components/About";
import ReviewPage from "../components/ReviewPage";
import Footer from "../components/Footer";

import home from "../assets/home1.jpg";
import ai from "../assets/ai.png";
import ai1 from "../assets/SearchAi.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden bg-black text-white">
      {/* HERO SECTION */}
      <section
        className="relative min-h-screen w-full 
        bg-[linear-gradient(90deg,oklch(50.8%_0.118_165.612),white)]"
      >
        <Nav />

        <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            Grow Your Skills
          </h1>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mt-3 text-gray-200">
            Advance Your Career Path
          </h2>

          <p className="max-w-2xl text-gray-100 mt-6 text-lg">
            Learn from industry experts with curated virtual courses designed to
            accelerate your growth.
          </p>

          <div className="mt-10 flex flex-wrap gap-5 justify-center">
            <button
              onClick={() => navigate("/allcourses")}
              className="px-7 py-3 border border-white rounded-xl text-lg flex items-center gap-3 hover:bg-white hover:text-black transition"
            >
              View All Courses
              <SiViaplay size={26} />
            </button>

            <button
              onClick={() => navigate("/searchwithai")}
              className="px-7 py-3 bg-white text-black rounded-xl text-lg flex items-center gap-3 hover:bg-gray-200 transition"
            >
              Search with AI

              {/* Desktop AI icon */}
              {ai && (
                <img
                  src={ai}
                  alt="AI Icon"
                  className="w-7 h-7 rounded-full hidden lg:block"
                />
              )}

              {/* Mobile AI icon */}
              {ai1 && (
                <img
                  src={ai1}
                  alt="AI Icon"
                  className="w-8 h-8 rounded-full lg:hidden"
                />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <section className="bg-white text-black">
        <Logos />
        <ExploreCourses />
        <Cardspage />
        <About />
        <ReviewPage />
      </section>

      <Footer />
    </div>
  );
}

export default Home;
