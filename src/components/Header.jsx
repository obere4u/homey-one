
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; //importing from react-router-dom
import SignUp from "../pages/SignUp";



export default function Header() {

   const [showModal, setShowModal] = useState(false);

  const location = useLocation(); {/* useLocation helps to point to the exact location of the path(route) */}
  const navigate = useNavigate(); //useNavigate is builtin function that helps us navigate inside the website
  function pathMatchRoute(route){
    //checks if the route is strictly equal the matching route
    if(route === location.pathname) {
      //location.pathname points to the route name
      return true;
    } 
  }

  

  
  return (
    <div className="bg-white border-b shadow-sm  top-0 z-50">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <SignUp onClose={() => setShowModal(false)} />
        </div>
      )}

      <header className="flex justify-between items-center pl-3 max-w-6xl">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-500 focus:text-gray-500 ${
                pathMatchRoute("/") && "!text-black !border-b-red-500"
              }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
              onClick={() => navigate("/")}
            >
              Home
            </li>

            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-500  focus:text-gray-500 ${
                pathMatchRoute("/offers") && "!text-black !border-b-red-500"
              }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>

            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-500  focus:text-gray-500 ${
                pathMatchRoute("/sign-in") && "!text-black !border-b-red-500"
              }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
              onClick={() => navigate("/sign-in")}
            >
              Sign in
            </li>

            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent hover:border-b-red-500 hover:text-gray-500  focus:text-gray-500 ${
                pathMatchRoute("/sign-up") && "!text-black !border-b-red-500"
              }`} //added ! to every attribute after && to make sure that those styles are used, ! means IMPORTANT!!!
              onClick={() => setShowModal(true)}
            >
              Sign Up
            </li>
          </ul>
        </div>
      </header>
    </div>
  );

}

