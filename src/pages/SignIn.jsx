import React, { useState } from 'react'
import OAuth  from '../components/OAuth';
import { Link } from 'react-router-dom';
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {

  

  function errorMessage(error) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email address";

      case "auth/email-already-in-use":
        return "The email address is already in use by another account";

      case "auth/missing-email":
        return "Please enter your Email Address";

      case "auth/missing-password":
        return "Please enter your Password";

      case "auth/invalid-password":
        return "Incorrect Password";

      default:
        return "Invalid Email or password";
    }
  }

  const [showPassword, setShowPassword] = useState(false); //showPassword is a hook and we set the useState to false so that the password will be hidden by default
  const [formData, setFormData] = useState({
    //hook that will cover the email, password etc
    email: "",
    password: "",
  });
  // no access to those formData so we need to destructure it like this
  const { email, password } = formData;
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
       ...prevState, /*prevState keeps the record of previous state and ...prevState will help us append things to the previous state*/
       [e.target.id]: e.target.value,
    }))
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if(userCredential.user) {
        navigate("/");
      }
      
    } catch (error) {
      const errorMessageString = errorMessage(error);
      toast.error(errorMessageString);
    }
  }

  return (
    <section>
      <h1 className="tracking-widest text-3xl text-center mt-8 font-bold ">
        Sign In
      </h1>
      <div className="flex justify-center flex-wrap items-center px-6 py-10 max-w-6xl mx-auto">
        <div className="md:w-[67%] lg:w-[45%] mb-12 md:mb-6">
          <img
            src="https://images.unsplash.com/photo-1575908539614-ff89490f4a78?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTV8fGtleXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            alt="Key"
            className=" w-full round-3xl"
          />
        </div>
        <div className="w-full md:w-[67%] lg:w-[45%] lg:ml-20">
          <form onSubmit={onSubmit}>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Username/Email-address"
              aria-required
              className="w-full px-4 py-2 text-large text-gray-700 bg-white border-gray-300 rounded-md transition ease-in-out mb-6"
            />
            {/*onChange is an eventListener that listens when something changes like typing something in a form field */}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="password"
                aria-required
                value={password}
                onChange={onChange}
                className="w-full px-4 py-2 text-large text-gray-700 bg-white border-gray-300 rounded-md"
              />
              {showPassword ? (
                <AiFillEye
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEyeInvisible
                  className="absolute right-3 top-3 text-xl cursor-pointer"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="flex justify-between whitespace-wrap px-3 text-sm sm:text-lg">
              <p>
                {`Don't have an account?`}
                <Link
                  to={"/sign-up"}
                  className="text-red-600 font-semibold ml-2 py-1 border-b-[2px] border-transparent hover:opacity-[0.8] cursor-pointer hover:border-b-red-500 transition duration-150 ease-in-out"
                >
                  Sign Up
                </Link>
              </p>
              <p>
                <Link
                  to={"/forgot-password"}
                  className="text-blue-600 font-semibold ml-2 py-1 border-b-[2px] border-transparent hover:opacity-[0.8] cursor-pointer hover:border-b-blue-500 transition duration-150 ease-in-out"
                >
                  Forgot Password
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-5 py-3 mt-6 tx-sm font-medium uppercase cursor-pointer hover:opacity-90 transition duration-150 ease-in-out rounded-lg shadow-md hover:shadow-lg active:bg-blue-700"
            >
              Sign In
            </button>
            <div className="flex items-center my-4 before:flex-1 before:border-t border-gray-400 after:flex-1 after:border-t after-gray-400">
              <p className="text-center font-semibold mx-4">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
}
