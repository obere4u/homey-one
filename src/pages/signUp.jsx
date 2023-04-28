import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import OAuth from "../components/OAuth";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false); //showPassword is a hook and we set the useState to false so that the password will be hidden by default
  const [formData, setFormData] = useState({
    //hook that will cover the username, email, password etc
    name: "",
    email: "",
    password: "",
  });
  // no access to those formData so we need to destructure it like this
  const { name, email, password } = formData;
  const navigate = useNavigate();

  function errorMessage(error) {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email address";

      case "auth/weak-password":
        return "Password should be at least 6 characters long";

      case "auth/email-already-in-use":
        return "The email address is already in use by another account";

      case "auth/missing-email":
        return "Please enter your Email Address";

      case "auth/invalid-display-name":
        return "Missing Name";

      case "auth/missing-password":
        return "Please enter your Password";

      case "auth/invalid-password":
        return "Incorrect Password";

      default:
        return "Something went wrong with registration";
    }
  }
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState /*prevState keeps the record of previous state and ...prevState will help us append things to the previous state*/,
      [e.target.id]: e.target.value,
    }));
  }
  //auth the user and navigate to homepage
  async function onSubmit(e) {
    e.preventDefault();
    if (name === "") {
      toast.error("Please enter your name")
      return
    }
    //trycatch() is modern way of trowing and catching error
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      updateProfile(auth.currentUser, {
        displayName: name
      })
      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign Up successful")
      navigate("/"); 
    } catch (error) {
      console.log(error.code);
      const errorMessageString = errorMessage(error);
      toast.error(errorMessageString);
      
    }
    
  }

  return (
    <section>
      <h1 className="tracking-widest text-3xl text-center mt-8 font-bold ">
        Sign Up
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
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Name"
              aria-required
              // required
              className="w-full px-4 py-2 text-large text-gray-700 bg-white border-gray-300 rounded-md transition ease-in-out mb-6"
            />
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email-address"
              aria-required
              // required
              className="w-full px-4 py-2 text-large text-gray-700 bg-white border-gray-300 rounded-md transition ease-in-out mb-6"
            />
            {/*onChange is an eventListener that listens when something changes like typing something in a form field */}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="password"
                value={password}
                onChange={onChange}
                aria-required
                // required
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
            <div className="flex justify-between whitespace-nowrap px-3 text-sm sm:text-lg">
              <p>
                Have an account?
                <Link
                  to={"/sign-in"}
                  className="text-red-600 font-semibold ml-2 py-1 border-b-[2px] border-transparent hover:opacity-[0.8] cursor-pointer hover:border-b-red-500 transition duration-150 ease-in-out"
                >
                  Sign In
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
              Sign Up
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
