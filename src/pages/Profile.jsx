import { getAuth } from 'firebase/auth';
import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify'
import {FcHome} from 'react-icons/fc'

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const {name, email} = formData;
  function onLoggedOut() {
    auth.signOut();
    navigate("/")
}

function onChange(e) {
  setFormData((prevState) => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }));
}

  async function onSubmit() {
    const prevName = auth.currentUser.displayName;
    try {
      if (prevName !== name) {
        //Update Display Name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        //Update name in DataBase (firebase)
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile Update Successful");

    } catch (error) {
      toast.error("Could not Update Profile details");
      // Revert name in the form to the previous name
      setFormData((prevState) => ({
        ...prevState,
        name: prevName,
      }));
    }
  }


  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/*Name Input*/}
            <input
              type="text"
              id="name"
              value={name}
              className={`w-full px-4 py-2 text-xl text-grey-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ${
                changeDetails && "!bg-green-100 !border-green"
              }`}
              disabled={!changeDetails}
              onChange={onChange}
            />

            <input
              type="email"
              id="email"
              value={email}
              className={`w-full px-4 py-2 text-xl text-grey-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ${
                changeDetails && "!bg-green-100 !border-green"
              }`}
              disabled={!changeDetails}
            />

            <div className="flex justify-between whitespace-nowrap text-md mb-6 px-6">
              <p className="flex items-center">
                Edit your name?
                <span
                  className="text-red-600 hover:text-red-700 transition ease-in-out duration:200ms ml-1 cursor-pointer font-semibold"
                  onClick={() => {
                    changeDetails && onSubmit();
                    setChangeDetails((preState) => !preState);
                  }}
                >
                  {changeDetails ? "Apply Changes" : "Edit"}
                </span>
              </p>
              <p
                className="text-blue-700 hover:text-blue-900 cursor-pointer transition ease-in-out duration-200ms font-semibold"
                onClick={onLoggedOut}
              >
                Sign Out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-small font-medium rounded-md shadow-md hover:bg-blue-700 transition ease-in-out duration:200ms ml-1 hover:shadow-lg active:bg-blue-800 cursor-pointer"
          >
            <Link to="/create-listing" className='flex justify-center items-center'>
              Sell or Rent Your Home <FcHome className='text-3xl ml-3 bg-red-200 rounded-full border-2 p-1'/>
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}
