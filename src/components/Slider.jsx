import React, { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Spinner from "./Spinner";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Slider() {
  const [listingsData, setListingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings() {
      try {
        const listingsRef = collection(db, "listings");
        const queryOptions = query(
          listingsRef,
          orderBy("timeStamp", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(queryOptions);
        let listings = [];

        querySnapshot.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListingsData(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching listings");
      }
    }
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!listingsData || listingsData.length === 0) {
    return <p>No listings available.</p>;
  }

  return (
    <>
      <Swiper
        modules={[A11y, Navigation, Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        navigation
        effect="fade"
        autoplay={{ delay: 3000 }}
      >
        {listingsData.map(({ data, id }) => {
          const formattedDiscountPrice = data.discountPrice
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          const formattedRegularPrice = data.regularPrice
            ?.toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

          return (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  backgroundImage: `url(${data.imgUrls && data.imgUrls[0]})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                className="relative w-full h-[300px] overflow-hidden"
              ></div>
              <p className="text-[#F1FAEE] absolute left-1 top-3 font-semibold max-w-[90%] bg-[#021f31] shadow-lg opacity-90 p-3 rounded-br-3xl rounded-tl-3xl">
                {data.name}
              </p>

              <p className="text-[#F1FAEE] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#E63946] shadow-lg opacity-90 p-3 rounded-br-3xl rounded-tl-3xl">
                ${formattedDiscountPrice ?? formattedRegularPrice}
                {data.type === "rent" && " /month"}
                {data.type === "sale" && " (Sale)"}
              </p>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
