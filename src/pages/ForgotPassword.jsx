import React, { useState } from "react";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  }

  return (
    <section>
      <h1 className="tracking-widest text-3xl text-center mt-8 font-bold ">
        Forgot Password
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
          <form>
            <input
              type="email"
              id="email"
              value={email}
              onChange={onChange}
              placeholder="Email-address"
              aria-required
              className="w-full px-4 py-2 text-large text-gray-700 bg-white border-gray-300 rounded-md transition ease-in-out mb-6"
            />
            {/*onChange is an eventListener that listens when something changes like typing something in a form field */}
            <div className="flex justify-between whitespace-nowrap px-3 text-sm sm:text-lg">
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
                  to={"/sign-in"}
                  className="text-blue-600 font-semibold ml-2 py-1 border-b-[2px] border-transparent hover:opacity-[0.8] cursor-pointer hover:border-b-blue-500 transition duration-150 ease-in-out"
                >
                  Sign In
                </Link>
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-5 py-3 mt-6 tx-sm tracking-wide font-medium uppercase cursor-pointer hover:opacity-90 transition duration-150 ease-in-out rounded-lg shadow-md hover:shadow-lg active:bg-blue-700"
            >
              Reset password
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
