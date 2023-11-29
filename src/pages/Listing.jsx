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
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// ... (import statements)

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
        {listing && (
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
        )}
        <div className="h-[200px] md:h-[400px] w-full z-10 overflow-x-hidden mt-5 md:mt-0 border">
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

const ListingDetailsSkeleton = (type) => {
  return (
    <div className="md:flex space-y-5 space-x-3">
      <div className="w-full pl-4">
        {/* Listing Name skeleton */}
        <div className="mb-2 pr-5">
          <Skeleton
            height={50}
            width={400}
          />
        </div>
        {/* Listing address skeleton */}
        <div className="mb-2">
          <Skeleton
            height={30}
            width={150}
          />
        </div>
        {/* Listing Type skeleton */}
        <div className="mb-2 flex items-center gap-20">
          {/* Conditionally render discounted price based on the type */}
          {type === "sale" && (
            <div className="">
              <Skeleton
                height={50}
                width={250}
              />
            </div>
          )}
        </div>
        {/* Listing Description skeleton */}
        <div>
          <Skeleton
            height={20}
            width={150}
          />
        </div>
        {/* Listing features skeleton */}
        <div className="flex justify-between items-enter mt-4">
          <div>
            <Skeleton
              height={20}
              width={100}
            />
          </div>
          <div>
            <Skeleton
              height={20}
              width={100}
            />
          </div>
          <div>
            <Skeleton
              height={20}
              width={100}
            />
          </div>
          <div>
            <Skeleton
              height={20}
              width={100}
            />
          </div>
        </div>
      </div>
      <div className="w-full pr-4">
        <div className="w-full h-[100%]">
          <Skeleton height={450} />
        </div>
      </div>
    </div>
  );
};

const ListingDetails = ({
  name,
  offer,
  formattedDiscountPrice,
  formattedRegularPrice,
  type,
  address,
  discount,
  description,
  bedrooms,
  bathrooms,
  park,
  furnish,
  auth,
  userRef,
  contactOwner,
  setContactOwner,
}) => {
  return (
    <div className="w-full ">
      <p className="text-xl md:text-2xl font-bold mb-3 text-blue-900">
        {name} - ${offer ? formattedDiscountPrice : formattedRegularPrice}
        {type === "rent" ? " / Month" : ""}
      </p>
      <p className="flex items-center my-3 font-semibold ">
        <FaMapMarkerAlt className="text-green-700 mr-1" />
        {address}
      </p>
      <div className="flex justify-start items-center space-x-4 ">
        <p className=" bg-red-800 w-full max-w-[200px] rounded-md p-1.5 text-white text-center font-semibold shadow-md">
          {type === "rent" ? "Rent" : "Sale"}
        </p>
        {type === "sale" ? (
          <div className=" bg-green-800 w-full max-w-[300px] rounded-md p-1.5 text-white text-center font-semibold shadow-md">
            <p>${discount} discount</p>
          </div>
        ) : (
          <div className="border border-green-700">
            <Skeleton
              height={50}
              width={100}
            />
          </div>
        )}
      </div>
      <p className="my-3">
        <span className="font-semibold">Description - </span>
        {description}
      </p>
      <ul className="grid grid-cols-3 lg:grid-cols-4 xlg:grid-cols-4 2xl:grid-cols-4 gap-2">
        <li className="flex items-center whitespace-nowrap">
          <FaBed className="text-lg mr-1" />
          {bedrooms > 1 ? `${bedrooms} Beds` : "1 Bed"}
        </li>
        <li className="flex items-center whitespace-nowrap">
          <FaBath className="text-lg mr-1" />
          {bathrooms > 1 ? `${bathrooms} Baths` : "1 Bath"}
        </li>
        <li className="flex items-center whitespace-nowrap">
          <FaParking className="text-lg mr-1" />
          {park ? "Parking Spot" : "No Parking"}
        </li>
        <li className="flex items-center whitespace-nowrap">
          <FaChair className="text-lg mr-1 " />
          {furnish ? "Furnished" : "Not Furnished"}
        </li>
      </ul>
      {userRef !== auth.currentUser?.uid && !contactOwner && (
        <div className="mt-6">
          <button
            onClick={() => setContactOwner(true)}
            className="px-7 py-3 bg-blue-600 text-white font-medium  text-sm uppercase rounded shadow-medium hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-100 ease-in-out"
          >
            Contact Owner
          </button>
        </div>
      )}
      {contactOwner && <Contact userRef={userRef} />}
    </div>
  );
};
