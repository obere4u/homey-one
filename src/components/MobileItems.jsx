import React, { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import PropTypes from "prop-types";
import "../index.css";
import { useLocation, useNavigate } from "react-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";


MobileItems.propTypes = {
  showMenu: PropTypes.func.isRequired,
  toggleMenu: PropTypes.bool.isRequired,
};

export default function MobileItems({ showMenu, toggleMenu }) {
  const [pageState, setPageState] = useState("Sign In");
  const location = useLocation(); //useLocation helps to point to the exact location of the path(route)
  const navigate = useNavigate(); //useNavigate is builtin function that helps us navigate inside the website
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign In");
      }
    });
  }, [auth]);

  function pathMatchRoute(route) {
    //checks if the route is strictly equal the matching route
    if (route === location.pathname) {
      //location.pathname points to the route name
      return true;
    }
  }

  return (
    <div
      className={`${
        toggleMenu
          ? "fixed inset-0 left-1/2 bg-[#102361] opacity-90 text-sm font-semibold flex-col pl-4 text-[12px] mx-auto  animate-slideLeft z-50 sm:hidden"
          : "hidden"
      }`}
    >
      <RiCloseLine
        color="#fff"
        size={32}
        onClick={showMenu}
        className="mt-2 mb-3 ml-auto mr-4 cursor-pointer"
      />
      <ul className="flex flex-col space-y-4">
        <li
          className={`cursor-pointer py-3 text-sm font-semibold text-white border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-400 focus:text-gray-500 ${
            pathMatchRoute("/") && "!text-black !border-b-red-500"
          }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
          onClick={() => navigate("/")}
        >
          Home
        </li>

        <li
          className={`cursor-pointer py-3 text-sm font-semibold text-white border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-400  focus:text-gray-500 ${
            pathMatchRoute("/offers") && "!text-black !border-b-red-500"
          }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
          onClick={() => navigate("/offers")}
        >
          Offers
        </li>

        <li
          className={`cursor-pointer py-3 text-sm font-semibold text-white border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-400 focus:text-gray-500 ${
            (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
            "!text-black !border-b-red-500"
          }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
          onClick={() => navigate("/profile")}
        >
          {pageState}
        </li>

        {/* <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-500  focus:text-gray-500 ${
                pathMatchRoute("/sign-up")  && "!text-black !border-b-red-500"
              }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </li> */}
      </ul>
    </div>
  );
}
