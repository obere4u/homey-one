import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Offers() {
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");

        //create listingQuery
        const listingQuery = query(
          listingRef,
          where("offer", "==", true),
          limit(8),
          orderBy("timeStamp", "desc")
        );

        //execute listingQUery
        const listingsQuerySnap = await getDocs(listingQuery);
        const lastVisible =
          listingsQuerySnap.docs[listingsQuerySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];

        listingsQuerySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setOffers(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Could not fetch listing");
      }
    }
    fetchListings();
  }, []);

  //Fetch more listings
  async function fetchMoreListing() {
    try {
      const listingRef = collection(db, "listings");

      //create listingQuery
      const listingQuery = query(
        listingRef,
        where("offer", "==", true),
        orderBy("timeStamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );

      //execute listingQuery
      const listingsQuerySnap = await getDocs(listingQuery);

      if (listingsQuerySnap.docs.length === 0) {
        // No more listings to fetch
        toast.info("No more listings");
        return;
      }

      const lastVisible =
        listingsQuerySnap.docs[listingsQuerySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];

      listingsQuerySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setOffers((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error fetching more listings");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y- pt-4">
      <div className="m-2 mb-6">
        {offers ? (
          <h2 className="font-semibold text-2xl px-3 mt-3">House for Sale</h2>
        ) : (
          <div>
            <Skeleton
              height={30}
              width={100}
            />
          </div>
        )}
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xlg:grid-cols-4 2xl:grid-cols-4 gap-2">
          {offers
            ? offers.map((listing) => (
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
        {lastFetchedListing && lastFetchedListing.length > 0 && (
          <div className="flex justify-center items-center">
            <button
              className="bg-white px-3 py-1.5 text-grey-700 border border-grey-300 mb-5 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
              onClick={fetchMoreListing}
            >
              Load more
            </button>
          </div>
        )}
        {lastFetchedListing === null && (
          <div className="flex justify-center items-center mt-3">
            <Skeleton
              height={30}
              width={100}
            />
          </div>
        )}
      </div>
    </div>
  );
}
