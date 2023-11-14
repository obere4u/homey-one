import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; //importing from react-router-dom
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import MobileItems from "./MobileItems";

export default function Header() {
  const [pageState, setPageState] = useState("Sign In");

  //Hamburger menu
  const [toggleMenu, setToggleMenu] = useState(false);

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

  function showMenu() {
    setToggleMenu((prevState) => !prevState);
  }

  return (
    <div className="bg-white border-b shadow-sm  top-0 z-40 py-3">
      <header className="flex justify-between items-center pl-3 pr-3 sm:pr-0 max-w-6xl">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="hidden items-center justify-center gap-1 ml-auto sm:flex space-x-10 sm:mr-6 xl:mr-0">
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
          {toggleMenu ? (
            ""
          ) : (
            <RiMenu3Line
              color="#000"
              size={27}
              onClick={showMenu}
              className="ml-auto cursor-pointer sm:hidden"
            />
          )}
          {toggleMenu && (
            <MobileItems
              showMenu={showMenu}
              toggleMenu={toggleMenu}
            />
          )}
        </div>
      </header>
    </div>
  );
}
