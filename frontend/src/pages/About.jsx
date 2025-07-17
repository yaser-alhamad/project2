import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-100 py-8 px-2 md:px-0">
      <div className="max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-8 py-12">
        <div className="text-center text-3xl font-bold text-teal-900 mb-10">
          <p>
            ABOUT <span className="text-teal-700 font-extrabold">US</span>
          </p>
        </div>
        <div className="my-10 flex flex-col md:flex-row gap-12 items-center">
          <img
            className="w-full md:max-w-[360px] rounded-2xl shadow-lg"
            src={assets.about_image}
            alt=""
          />
          <div className="flex flex-col justify-center gap-6 md:w-2/4 text-base text-gray-700">
            <p>
              Welcome to Blank, your trusted partner in managing your healthcare
              needs conveniently and efficiently. At Blank, we understand the
              challenges individuals face when it comes to scheduling doctor
              appointments and managing their health records.
            </p>
            <p>
              Blank is committed to excellence in healthcare technology. We
              continuously strive to enhance our platform, integrating the
              latest advancements to improve user experience and deliver
              superior service. Whether you&apos;re booking your first
              appointment or managing ongoing care, Blank is here to support you
              every step of the way.
            </p>
            <b className="text-teal-900">Our Vision</b>
            <p>
              Our vision at Blank is to create a seamless healthcare experience
              for every user. We aim to bridge the gap between patients and
              healthcare providers, making it easier for you to access the care
              you need, when you need it.
            </p>
          </div>
        </div>
        <div className="text-2xl font-bold text-teal-900 my-8 text-center">
          <p>
            WHY <span className="text-teal-700 font-extrabold">CHOOSE US</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 mb-4">
          {[
            {
              title: "EFFICIENCY",
              desc: "Streamlined appointment scheduling that fits into your busy lifestyle.",
            },
            {
              title: "CONVENIENCE",
              desc: "Access to a network of trusted healthcare professionals in your area.",
            },
            {
              title: "PERSONALIZATION",
              desc: "Tailored recommendations and reminders to help you stay on top of your health.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-md px-8 py-10 flex flex-col gap-4 text-base text-teal-900 border border-teal-100 hover:bg-teal-50 hover:shadow-lg transition-all cursor-pointer"
            >
              <b className="text-lg">{item.title}</b>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
