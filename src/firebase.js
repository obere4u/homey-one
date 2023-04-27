// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkdIpV6RL6bBr66vheAWMbgSdXKTPhlgU",
  authDomain: "react-realtor-clone-53d8d.firebaseapp.com",
  projectId: "react-realtor-clone-53d8d",
  storageBucket: "react-realtor-clone-53d8d.appspot.com",
  messagingSenderId: "384330127644",
  appId: "1:384330127644:web:95d195565d67b0689202d9",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
