import React, { useEffect, useState } from "react";
// import Slider from "../components/Slider";
import OfferListings from "../components/OfferListings";
import RentListings from "../components/RentListings";
import SaleListings from "../components/SaleListings";

export default function Home() {
  return (
    <div>
      {/*<Slider />*/}
      <OfferListings />
      <RentListings />
      <SaleListings />
    </div>
  );
}
