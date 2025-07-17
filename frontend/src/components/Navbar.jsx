import { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  // Controls mobile menu
  const [showMenu, setShowMenu] = useState(false);

  // Controls desktop-profile dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  // Close dropdown if click happens outside of it
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="relative z-40 flex items-center justify-between text-sm py-4 px-6 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          onKeyDown={e => e.key === "Enter" && navigate("/")}
          className="w-14 cursor-pointer drop-shadow-md"
          src={assets.logo}
          alt="App logo"
          tabIndex={0}
        />

        {/* Desktop Links */}
        <ul className="hidden md:flex items-start gap-7 font-semibold">
          {[
            { to: "/", label: "HOME" },
            { to: "/doctors", label: "ALL DOCTORS" },
            { to: "/about", label: "ABOUT" },
            { to: "/contact", label: "CONTACT" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-700 underline underline-offset-4"
                  : "text-gray-700"
              }
            >
              <li className="py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors focus:outline-blue-700" tabIndex={0}>
                {label}
              </li>
            </NavLink>
          ))}
        </ul>

        {/* Right side: profile / login & mobile menu button */}
        <div className="flex items-center gap-4">
          {token && userData ? (
            // Desktop profile dropdown
            <div ref={dropdownRef} className="relative z-50">
              <button
                onClick={() => setDropdownOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                className="flex items-center gap-1 focus:outline-none"
              >
                <img
                  className="w-8 h-8 rounded-full border-2 border-blue-200 shadow"
                  src={userData.image}
                  alt="User profile"
                />
                <img
                  className="w-2.5"
                  src={assets.dropdown_icon}
                  alt="Toggle dropdown"
                />
              </button>

              {dropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg text-gray-600 font-medium z-50"
                >
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/my-profile");
                    }}
                    className="w-full text-left px-4 py-2 hover:text-blue-700"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/my-appointments");
                    }}
                    className="w-full text-left px-4 py-2 hover:text-blue-700"
                  >
                    My Appointments
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 hover:text-blue-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:block bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-colors"
            >
              Create account
            </button>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden"
            aria-label="Open menu"
          >
            <img src={assets.menu_icon} alt="Open menu" />
          </button>
        </div>
      </nav>

      {/* ---- Mobile Menu ---- */}
      <div
        className={`md:hidden ${
          showMenu ? "fixed top-0 left-0 w-full h-full z-[9999]" : "hidden"
        } bg-white/90 backdrop-blur-md transition-all`}
        aria-hidden={!showMenu}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <img src={assets.logo} className="w-14" alt="App logo" />
          <button
            onClick={() => setShowMenu(false)}
            aria-label="Close menu"
            className="w-7"
          >
            <img src={assets.cross_icon} alt="Close menu" />
          </button>
        </div>

        {/* Mobile nav links */}
        <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-semibold">
          {[
            { to: "/", label: "HOME" },
            { to: "/doctors", label: "ALL DOCTORS" },
            { to: "/about", label: "ABOUT" },
            { to: "/contact", label: "CONTACT" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-blue-700 underline underline-offset-4"
                  : "text-gray-700"
              }
            >
              <p className="px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors" tabIndex={0}>
                {label}
              </p>
            </NavLink>
          ))}
        </ul>

        {/* Mobile profile / auth */}
        <div className="flex flex-col items-center gap-4 mt-6 px-5">
          {token && userData ? (
            <div className="flex flex-col items-center gap-2 w-full">
              <img
                className="w-12 h-12 rounded-full mb-2 border-2 border-blue-200 shadow"
                src={userData.image}
                alt="User profile"
              />
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/my-profile");
                }}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mb-1 font-semibold"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  navigate("/my-appointments");
                }}
                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-800 px-4 py-2 rounded-lg mb-1 font-semibold"
              >
                My Appointments
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  logout();
                }}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/login");
              }}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-full font-semibold"
            >
              Create account
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
