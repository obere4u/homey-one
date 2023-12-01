import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ListingDetailsSkeleton() {

  return (
    <div className="w-full rounded-lg shadow-lg px-4 md:flex space-y-5 md:space-x-7">
      <div className="w-full flex flex-col gap-2">
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
        <Skeleton height={30} />

        {/* Listing features skeleton */}
        <div className="grid grid-cols-3 lg:grid-cols-4 xlg:grid-cols-4 2xl:grid-cols-4 gap-2">
          <div className="w-full">
            <Skeleton height={15} />
          </div>

          <div className="w-full">
            <Skeleton height={15} />
          </div>

          <div className="w-full">
            <Skeleton height={15} />
          </div>

          <div className="w-full">
            <Skeleton height={15} />
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
