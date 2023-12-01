import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ListingDetailsSkeleton() {

  return (
    <div className="md:flex space-y-5 space-x-7">
      <div className="w-full flex flex-col space-y-3">
        {/* Listing Name skeleton */}
        <Skeleton height={50} />

        {/* Listing address skeleton */}
        <Skeleton
          height={30}
          width={150}
        />

        {/* Conditionally render discounted price based on the type */}
        <div className="flex space-x-6">
          <div className=" w-full border border-green-900">
            <Skeleton height={30} />
          </div>
          <div className=" w-full border border-green-900">
            <Skeleton height={30} />
          </div>
        </div>

        {/* Listing Description skeleton */}
        <Skeleton height={50} />

        {/* Listing features skeleton */}
        <div className="flex space-x-3 items-enter mt-4">
          <Skeleton
            height={20}
            width={50}
          />

          <Skeleton
            height={20}
            width={50}
          />

          <Skeleton
            height={20}
            width={50}
          />

          <Skeleton
            height={20}
            width={50}
          />
        </div>

        {/*Conditionally check if not user, display contact owner */}
        <Skeleton height={40}/>
      </div>

      {/*Map Skeleton*/}
      <div className="w-full ">
        <Skeleton height={450} />
      </div>
    </div>
  );
}
