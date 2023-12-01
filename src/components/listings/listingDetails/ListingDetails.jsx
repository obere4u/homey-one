import React from "react";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import Contact from "../../../pages/Contact";

export default function ListingDetails({
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
}) {
  return (
    <div className="w-full ">
      <div className="text-xl md:text-2xl font-bold mb-3 text-blue-900 flex gap-1">
        {name} -{" "}
        <div className="flex flex-col md:flex-row ">
          ${formattedRegularPrice}
          {type === "rent" ? " / Month" : ""}
          {offer ? (
            <div className=" line-through text-sm md:ml-3">
              ${discount} discount
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <p className="flex items-center my-3 font-semibold ">
        <FaMapMarkerAlt className="text-green-700 mr-1" />
        {address}
      </p>

      <div className="flex justify-start items-center space-x-4 ">
        <button
          onClick={() => setContactOwner(true)}
          className=" bg-red-800 w-full rounded-md p-1.5 text-white text-center font-semibold shadow-md"
        >
          {type === "rent" ? "Rent" : "Sale"}
        </button>
      </div>

      <p className="my-3 text-lg">
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
}
