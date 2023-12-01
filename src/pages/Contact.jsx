import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router";

export default function Contact({ userRef }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");
  const [listing, setListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    async function getOwner() {
      if (userRef) {
        const docRef = doc(db, "users", userRef);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOwner(docSnap.data());
        } else {
          toast.error("Could not get owner details");
        }
      }
    }
    getOwner();
  }, [userRef]);

  //listing
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
      }
    }
    fetchListing();
  }, [params.listingId]);

  function onChange(e) {
    setMessage(e.target.value);
  }

  console.log(listing);
  return (
    <>
      {owner !== null && (
        <div className="flex flex-col w-full">
          <div className="mt-6 mb-3">
            Contact
            <span className="font-semibold mx-1">{owner.name}</span>for
            <span className="font-semibold mx-1">{listing?.name}</span>
          </div>
          <div>
            <textarea
              name="message"
              id="message"
              rows="2"
              onChange={onChange}
              className="w-full py-4 px-2 text-large text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-300"
            ></textarea>
          </div>

          <a
            href={`mailto:${owner.email}?Subject=${listing?.name}&body${message}`}
          >
            <button
              type="button"
              className="w-full center px-7 py-3 mt-3 bg-blue-600 text-white rounded text-small uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
