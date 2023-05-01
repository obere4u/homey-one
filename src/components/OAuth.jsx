import React from 'react'
import { FcGoogle } from "react-icons/Fc";
import { toast } from 'react-toastify';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { db } from '../firebase';
import { doc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';



export default function OAuth() {

  const navigate = useNavigate();

  async function onGoogleClick() {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }

      navigate("/");
      
    } catch (error) {
      toast.error("Could not authorize with Google");
    }
  }

  return (
    <button className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:opacity-90 active:bg-red-800 shadow-md hover:shadow:lg active:shadow-lg transition duration-150 ease-in-out rounded-md' 
    type='button'
    onClick={onGoogleClick}>
      Continue with Google <FcGoogle className='text-2xl ml-3 w-ful'/>
    </button>
    );
    
}
