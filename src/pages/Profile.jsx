import { getAuth } from 'firebase/auth';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import  db  from '../firebase';
import { toast } from 'react-toastify'

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
  try {
    if (auth.currentUser.displayName !== name) {
      //Update Display Name in firebase auth
      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      //Update name in DataBase (firebase)
      const docRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(docRef, {
        name
      })
    }
    toast.success("Profile Update Successful");
  } catch (error) {
    toast.error("Could not Update Profile details")

  }
}


  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            {/*Name Input*/}
            <input type="text" id="name" value={name} className={`w-full px-4 py-2 text-xl text-grey-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ${changeDetails && "!bg-green-100 !border-green"}`}
            disabled = {!changeDetails}
            onChange={onChange} />
           
            <input type="email" id="email" value={email} className={`w-full px-4 py-2 text-xl text-grey-700 bg-white border border-gray-300 rounded transition ease-in-out mb-6 ${changeDetails && "!bg-green-100 !border-green"}`}
            disabled = {!changeDetails} />

            <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6 px-6">
              <p className="flex items-center">Do you want to change your name?
                <span className='text-red-600 hover:text-red-700 transition ease-in-out duration:200ms ml-1 cursor-pointer font-semibold' onClick={() => {
                  changeDetails && onSubmit(); setChangeDetails((preState) => !preState)}}>
                {changeDetails ? "Apply Changes" : "Edit"}</span>
              </p>
              <p className="text-blue-700 hover:text-blue-900 cursor-pointer transition ease-in-out duration-200ms font-semibold" onClick={onLoggedOut}>Sign Out</p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
