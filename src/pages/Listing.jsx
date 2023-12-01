import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { getAuth } from "firebase/auth";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { FaShare } from "react-icons/fa";
import ListingDetails from "../components/listings/listingDetails/ListingDetails";
import ListingDetailsSkeleton from "../components/listings/listingDetails/ListingDetailsSkeleton";

export default function Listing() {
  const params = useParams();
  const auth = getAuth();
  const [listing, setListing] = useState(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactOwner, setContactOwner] = useState(false);
  const [type, setType] = useState("");

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setType(docSnap.data().type);
      }
    }
    fetchListing();
  }, [params.listingId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  console.log(listing)

  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <SwiperSkeleton />
        <ListingDetailsSkeleton />
      </div>
    );
  }

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
      {listing ? (
        <Swiper
          modules={[A11y, Navigation, Pagination, Autoplay, EffectFade]}
          slidesPerView={1}
          navigation
          pagination={{ type: "progressbar" }}
          effect="fade"
          autoplay={{ delay: 3000 }}
        >
          {listing &&
            listing.imgUrls.map((imgUrl, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative  h-[300px] overflow-hidden"
                  style={{
                    background: `url(${imgUrl}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          <div
            className="absolute top-[77%]  right-4 z-10 cursor-pointer border-2 border-gray-400 rounded-full w-10 h-10 flex justify-center items-center bg-white"
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
        </Swiper>
      ) : (
        <SwiperSkeleton />
      )}

      {shareLinkCopied && (
        <span className="fixed top-[22%] right-[1%] text-white font-semibold z-10  bg-slate-500 rounded p-2">
          Link copied
        </span>
      )}

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg lg:space-x-5 md:space-x-5">
        {listing ? (
          <ListingDetails
            name={listing.name}
            offer={listing.offer}
            formattedDiscountPrice={formattedDiscountPrice}
            formattedRegularPrice={formattedRegularPrice}
            type={type}
            address={listing.address}
            discount={discount}
            description={listing.description}
            bedrooms={listing.bedrooms}
            bathrooms={listing.bathrooms}
            park={listing.park}
            furnish={listing.furnish}
            auth={auth}
            userRef={listing.userRef}
            contactOwner={contactOwner}
            setContactOwner={setContactOwner}
          />
        ) : (
          <ListingDetailsSkeleton key={index} />
        )}

        {/* Map Details */}
        <div className="h-[200px] md:h-[400px] w-full z-10 overflow-x-hidden mt-5 md:mt-0 border ">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.long]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.long]}
            >
              <Popup>{listing.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}

// Skeleton components
const SwiperSkeleton = () => (
  <div className="w-full max-w-6xl">
    <Skeleton height={300} />
  </div>
);
