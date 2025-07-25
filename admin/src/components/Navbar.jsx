import { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { useNavigate, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { MenuIcon, ArrowRightIcon } from "@heroicons/react/solid";

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [isMenuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuVisible(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setMenuVisible((v) => !v);

  const logout = () => {
    navigate("/");
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
    }
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
    }
  };

  return (
    <div className="navbar flex justify-between items-center px-4 sm:px-10 py-3 h-14 border-b bg-white z-50 relative">
      <div className="flex items-center gap-2 text-xs">
        <img
          onClick={() => navigate("/")}
          className="m:w-20 sm:w-14 w-12 cursor-pointer"
          src={assets.admin_logo}
          alt="Logo"
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>

      <button
        onClick={toggleMenu}
        className="md:hidden p-2 bg-primary text-white text-sm rounded-full"
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {isMenuVisible && aToken && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <NavLink
            to="/admin-dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={toggleMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/all-appointments"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Appointments
          </NavLink>
          <NavLink
            to="/doctor-list"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Doctors List
          </NavLink>
          <NavLink
            to="/allpatients"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Patients Record
          </NavLink>
          <NavLink
            to="/admin/manage-slots"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Manage Slots
          </NavLink>
          <button
            onClick={() => {
              toggleMenu();
              logout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}

      {isMenuVisible && dToken && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <NavLink
            to="/doctor-dashboard"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/doctor/new-appointments"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            New Appointments
          </NavLink>
          <NavLink
            to="/doctor/manage-slots_doctor"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Manage Slots
          </NavLink>
          <NavLink
            to="/doctor-profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Profile
          </NavLink>
          <NavLink
            to="/doctor/patients"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
            onClick={toggleMenu}
          >
            Patients Record
          </NavLink>
          <button
            onClick={() => {
              toggleMenu();
              logout();
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
          >
            Logout <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      )}

      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full hidden md:block"
      >
        Logout
      </button>
    </div>
  );
};

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;
