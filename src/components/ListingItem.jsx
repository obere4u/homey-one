import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing, id }) {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-3">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          src={listing.imgUrls[0]}
          alt="Listing Image"
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
        />
        <Moment
          fromNow
          className="absolute top-2 right-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
        >
          {listing.timeStamp?.toDate()}
        </Moment>
        <div className="w-full p-2">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="font-semibold text-sm mb-[2px] text-grey-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold m-0 text-xl truncate">{listing.name}</p>
          <p className="text-[#457b93] mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-[10px] space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {" "}
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
