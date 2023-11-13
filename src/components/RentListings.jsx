import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "./ListingItem";

export default function RentListings() {
  const [rentListings, setRentListings] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");

        //create query
        const listingsQuery = query(
          listingsRef,
          where("type", "==", "rent"),
          orderBy("timeStamp", "desc"),
          limit(4)
        );

        //execute listingsQuery
        const listingsQuerySnap = await getDocs(listingsQuery);

        const listings = [];

        listingsQuerySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setRentListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();
  }, []);
  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6">
      {rentListings && rentListings.length > 0 && (
        <div className="m-2 mb-6">
          <h2 className="font-semibold text-2xl mt-3 px-3">House for Rents</h2>
          <Link to="/categories/rent">
            <small className="text-sm text-blue-600 px-3 hover:text-blue-700 transition duration-150 ease-in-out">
              Show more places for rent
            </small>
          </Link>

          <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xlg:grid-cols-4">
            {rentListings.map((listing) => (
              <div>
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              </div>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
