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
import { useParams } from "react-router-dom";

export default function Offers() {
  const [offers, setOffers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingRef = collection(db, "listings");

        //create listingQuery
        const listingQuery = query(
          listingRef,
          where("type", "==", params.categoryName),
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
  }, [params.categoryName]);

  //Fetch more listings
  async function fetchMoreListing() {
    try {
      const listingRef = collection(db, "listings");

      //create listingQuery
      const listingQuery = query(
        listingRef,
        where("type", "==", params.categoryName),
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
      <h1 className="text-3xl font-bold text-center mt-4">Places for {params.categoryName === "rent" ? "rent" : "Sale"}</h1>
      {loading ? (
        <Spinner />
      ) : offers && offers.length > 0 ? (
        <>
          <main>
            <ul className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xlg:grid-cols-4 2xl:grid-cols-4">
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
            <p className="text-xl text-center">There are currently no place for {param.categoryName === "rent" ? "rent" : "sale"}</p>
      )}
    </div>
  );
}
