import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 py-8 px-2 md:px-0">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md shadow-lg rounded-2xl px-8 py-12">
        <div className="text-center text-3xl font-bold text-blue-900 mb-10">
          <p>
            CONTACT <span className="text-blue-700 font-extrabold">US</span>
          </p>
        </div>
        <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-10 text-base items-center">
          <img
            className="w-full md:max-w-[320px] rounded-2xl shadow-lg"
            src={assets.contact_image}
            alt=""
          />
          <div className="flex flex-col justify-center items-start gap-6 w-full md:w-2/3">
            <p className="font-bold text-lg text-blue-900">OUR OFFICE</p>
            <p className="text-gray-700">
              Survey No. 140 - 141/1 <br /> Indian Institute of Information Technology, Nagpur (IIITN)
            </p>
            <p className="text-gray-700">
              Tel: (91) 8468938745 <br /> Email: vasuparashar18@gmail.com
            </p>
            <p className="font-bold text-lg text-blue-900">CAREERS AT Blank</p>
            <p className="text-gray-700">
              Learn more about our teams and job openings.
            </p>
            <button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 text-base rounded-full font-semibold shadow-md transition-all duration-300">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
