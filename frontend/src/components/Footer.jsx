import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <footer
      className="w-full max-w-7xl mx-auto mt-24 mb-4 px-6 py-10 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl"
      aria-label="Footer"
    >
      <div className="flex flex-col md:grid grid-cols-[3fr_1fr_1fr] gap-10 md:gap-20 text-base">
        <div>
          <img className="mb-5 w-24" src={assets.logo} alt="App logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Book appointments with trusted doctors. Your health, our priority.
          </p>
        </div>
        <div>
          <p className="text-lg font-bold mb-4 text-teal-900">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a
                href="/"
                className="hover:text-teal-700 cursor-pointer transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-teal-700 cursor-pointer transition-colors"
              >
                About us
              </a>
            </li>
            <li>
              <a
                href="/doctors"
                className="hover:text-teal-700 cursor-pointer transition-colors"
              >
                Doctors
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-teal-700 cursor-pointer transition-colors"
              >
                Privacy policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-lg font-bold mb-4 text-teal-900">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <a
                href="tel:+963900000000"
                className="hover:text-teal-700 cursor-pointer transition-colors"
              >
                +963-900-000-000
              </a>
            </li>
            <li>
              <a
                href="mailto:info@example.com"
                className="hover:text-teal-700 cursor-pointer transition-colors"
              >
                info@example.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <hr className="border-gray-200" />
        <p className="py-4 text-xs text-center text-gray-500">
          &copy; 2024 example.com - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
