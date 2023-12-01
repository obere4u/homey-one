import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ListingDetailsSkeleton() {

  return (
    <div className="w-full rounded-lg shadow-lg px-4 md:flex space-y-5 space-x-7">
      <div className="w-full">
        {/* Listing Name skeleton */}
        <Skeleton height={50} />

        {/* Listing address skeleton */}
        <Skeleton
          height={30}
          width={150}
        />

        {/* Conditionally render discounted price based on the type */}
        <div className="flex space-x-6">
          <div className="w-full">
            <Skeleton height={30} />
          </div>

          <div className="w-full">
            <Skeleton height={30} />
          </div>
        </div>

        {/* Listing Description skeleton */}
        <Skeleton height={50} />

        {/* Listing features skeleton */}
        <div className="flex space-x-3 items-enter mt-4">
          <div className="w-full">
            <Skeleton height={20} />
          </div>

          <div className="w-full">
            <Skeleton height={20} />
          </div>

          <div className="w-full">
            <Skeleton height={20} />
          </div>

          <div className="w-full">
            <Skeleton height={20} />
          </div>

          
        </div>

        {/*Conditionally check if not user, display contact owner */}
        <Skeleton height={40} />
      </div>

      {/*Map Skeleton*/}
      <div className="w-full ">
        <Skeleton height={450} />
      </div>
    </div>
  );
}
