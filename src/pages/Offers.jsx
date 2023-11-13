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

      //execute listingQUery
      const listingsQuerySnap = await getDocs(listingQuery);
      const lastVisible =
        listingsQuerySnap.docs[listingsQuerySnap.docs.length - 1];
      setLastFetched(lastVisible);

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
      toast.error("No more listing");
    }
  }

  return (
    <div className="max-w-6xl mx-auto pt-4 space-y-6">
      <h2 className="text-3xl font-bold text-center mt-4">Offers</h2>
      {loading ? (
        <Spinner />
      ) : offers && offers.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:gri-cols-2 lg:grid-cols-3 xlg:grid-cols-4 2xl:grid-cols-4">
              {offers.map((offer) => (
                <ListingItem
                  key={offer.id}
                  listing={offer.data}
                  id={offer.id}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className="flex justify-center items-center">
              <button
                className="bg-white px-3 py-1.5 text-grey-700 border border-grey-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-in-out"
                onClick={fetchMoreListing}
              >
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-xl text-center">There are currently no offers</p>
      )}
    </div>
  );
}
