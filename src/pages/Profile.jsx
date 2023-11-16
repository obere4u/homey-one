import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || "",
    email: auth.currentUser?.email || "",
  });
  const { name, email } = formData;

  function onLoggedOut() {
    auth.signOut();
    navigate("/");
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
        // Update Display Name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update name in DataBase (firebase)
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

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const userQuery = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      try {
        const querySnap = await getDocs(userQuery);
        let listings = [];
        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching listings");
      }
    }
    if (auth.currentUser) {
      fetchUserListings();
    }
  }, [auth.currentUser]);

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete listing?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Listing successfully deleted");
    }
  }

  function onEdit(listingID) {
    navigate(`/edit-listing/${listingID}`);
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
          <Link
            to="/create-listing"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-small font-medium rounded-md shadow-md hover:bg-blue-700 transition ease-in-out duration:200ms ml-1 hover:shadow-lg active:bg-blue-800 cursor-pointer flex justify-center items-center"
          >
            Sell or Rent Your Home
            <FcHome className="text-3xl ml-3 bg-red-200 rounded-full border-2 p-1" />
          </Link>
        </div>
      </section>

      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold">My Listings</h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 my-6">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                    onDelete={() => onDelete(listing.id)}
                    onEdit={() => onEdit(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
