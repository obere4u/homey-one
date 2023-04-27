import React from 'react'
import { FcGoogle } from "react-icons/Fc";

export default function OAuth() {
  return (
    <button className='flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:opacity-90 active:bg-red-800 shadow-md hover:shadow:lg active:shadow-lg transition duration-150 ease-in-out rounded-md'>
      Continue with Google <FcGoogle className='text-2xl ml-3 w-ful'/>
    </button>
  );
}
