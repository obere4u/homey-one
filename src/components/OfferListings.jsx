import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OfferListings() {
  const [offerListings, setOfferListings] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchListings() {
      try {
        //get reference
        const listingsRef = collection(db, "listings");

        //create query
        const listingsQuery = query(
          listingsRef,
          where("offer", "==", true),
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
        setOfferListings(listings);
      } catch (error) {
        console.log(error);
      }
    }
    fetchListings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6">
      <div className="m-2 mb-6">
        {offerListings ? (
          <h2 className="font-semibold px-3 text-2xl mt-3">Recent Offers</h2>
        ) : (
          <div>
            <Skeleton
              height={30}
              width={150}
            />
          </div>
        )}

        {offerListings ? (
          <Link to="/offers">
            <small className="text-sm text-blue-600 px-3 hover:text-light-blue-800 transition duration-150 ease-in-out">
              Show more offers
            </small>
          </Link>
        ) : (
          <div>
            <Skeleton
              height={30}
              width={100}
            />
          </div>
        )}

        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xlg:grid-cols-4 2xl:grid-cols-4        gap-2">
          {offerListings
            ? offerListings.map((listing) => (
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
