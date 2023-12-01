import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ListingItemSkeleton({regularPrice, listing}) {
  console.log('regularPrice:', regularPrice);
  console.log('listing:', listing);
  
  return (
    <div className="w-full  flex flex-col  rounded-lg shadow-lg">
      {/* Listing Image skeleton */}
      <Skeleton height={170} />

      {/*body of skeleton */}
      <div className="pl-2">
        {/* Listing address skeleton */}
        <Skeleton
          height={10}
          width={100}
        />

        {/* Listing Name skeleton */}
        <Skeleton height={20} />

        {/* Listing description skeleton */}
        <Skeleton height={20} />

        {/* Conditionally render discounted price based on the type */}
        {regularPrice && (
          <Skeleton
            height={20}
            width={100}
          />
        )}
        <Skeleton height={20} />

        {/* Listing features skeleton */}
        <div className="flex space-x-3 items-center mt-4 ">
          <div className="w-[50px]">
            <Skeleton height={20} />
          </div>

          <div className="w-[50px]">
            <Skeleton height={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
