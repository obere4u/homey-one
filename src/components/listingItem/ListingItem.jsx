import React from "react";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import ListingItemSkeleton from "./ListingItemSkeleton";

export default function ListingItem({ listing, id, onDelete, onEdit }) {
  const isOffer = listing.offer !== undefined && listing.offer > 0;

  const formattedDiscountPrice = listing.discountPrice
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const formattedRegularPrice = listing.regularPrice
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div>
      {listing ? (
        <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-3">
          <Link
            className="contents"
            to={`/category/${listing.type}/${id}`}
          >
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
              <p className="font-semibold m-0 text-xl truncate">
                {listing.name}
              </p>
              <div className="flex gap-1 items-center just mt-2 text-[#457b93] font-semibold">
                <div className="flex flex-col">
                  {isOffer && (
                    <span className="line-through text-xs text-gray-500">
                      ${formattedRegularPrice}
                    </span>
                  )}
                  <span className="text-[#457b93] font-semibold">
                    {isOffer ? (
                      <span>${formattedDiscountPrice}</span>
                    ) : (
                      <span>${formattedRegularPrice}</span>
                    )}
                  </span>
                </div>
                {listing.type === "rent" && " / month"}
              </div>
              <div className="flex items-center mt-[10px] space-x-3">
                <div className="flex items-center space-x-1">
                  <p className="font-bold text-xs">
                    {" "}
                    {listing.bedrooms > 1
                      ? `${listing.bedrooms} Beds`
                      : "1 Bed"}
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
          {onDelete && (
            <FaTrash
              className="absolute bottom-2 right-2 h-[14px] cursor-pointer text-red-700"
              onClick={() => onDelete(listing.id)}
            />
          )}
          {onEdit && (
            <MdEdit
              className="absolute bottom-2 right-8 h-4 cursor-pointer text-black"
              onClick={() => onEdit(listing.id)}
            />
          )}
        </li>
      ) : (
        <ListingItemSkeleton regularPrice={listing.regularPrice} listing={listing}/>
      )}
    </div>
  );
}
