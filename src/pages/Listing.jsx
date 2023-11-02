import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import {
  A11y,
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { getAuth } from "firebase/auth";
import Contact from "./Contact";

export default function Listing() {
  const params = useParams();
  const auth = getAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactOwner, setContactOwner] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }

    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formattedDiscountPrice = listing.discountPrice
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formattedRegularPrice = listing.regularPrice
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const discount = (listing.regularPrice - listing.discountPrice)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <main>
      <Swiper
        modules={[A11y, Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
      >
        {listing &&
          listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative w-full h-[300px] overflow-hidden"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div
        className="fixed top-[14%] right-[3%] z-10 cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center bg-white"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-600" />
      </div>
      {shareLinkCopied && (
        <span className="fixed top-[22%] right-[1%] text-white font-semibold z-10  bg-slate-500 rounded p-2">
          Link copied
        </span>
      )}

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg lg:space-x-5">
        <div className="w-fullG">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {/* adds coma after every 3 digits (.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) */}
            {listing.name} - $
            {listing.offer ? formattedDiscountPrice : formattedRegularPrice}
            {listing.type === "rent" ? " / Month" : ""}
          </p>
          <p className="flex items-center my-3 font-semibold ">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.offer && <p>${discount} discount</p>}
            </p>
          </div>
          <p className="my-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.park ? "Parking Spot" : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnish ? "Furnished" : "Not Furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactOwner && (
            <div className="mt-6">
              <button
                onClick={() => setContactOwner(true)}
                className="px-7 py-3 bg-blue-600 text-white font-medium  text-sm uppercase rounded shadow-medium hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-100 ease-in-out"
              >
                Contact Owner
              </button>
            </div>
          )}
          {contactOwner && (
            <Contact
              userRef={listing.userRef}
              listing={listing}
            />
          )}
        </div>
        <div className="w-full h-[200px] lg-[400px] bg-red-600 z-10 overflow-x-hidden"></div>
      </div>
    </main>
  );
}
