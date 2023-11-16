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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
      <div className="m-2 mb-6">
        <h2 className="font-semibold text-2xl mt-3 px-3">House for Rents</h2>
        <Link to="/category/rent">
          <small className="text-sm text-blue-600 px-3 hover:text-blue-700 transition duration-150 ease-in-out">
            Show more places for rent
          </small>
        </Link>

        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xlg:grid-cols-4 2xl:grid-cols-4        gap-2">
          {rentListings
            ? rentListings.map((listing) => (
                <div key={listing.id}>
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                </div>
              ))
            : Array.from({ length: 4 }, (_, index) => (
                <div key={index}>
                  <Skeleton height={300} />
                </div>
              ))}
        </ul>
      </div>
    </div>
  );
}
