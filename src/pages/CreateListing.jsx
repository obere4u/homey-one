import React, { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    regularPrice,
    discountPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const [value, setValue] = useState('');

  //Load saved formData
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("formData"));
    if (savedFormData) {
      setFormData(savedFormData);
    }
  }, []);

  //Save formData
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  function onChange(e) {
    let boolean = null;

    //true
    if (e.target.value === "true") {
      boolean = true;
    }
    //false
    if (e.target.value === "false") {
      boolean = false;
    }

    //images
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // number
    if (e.target.type === "number") {
      const inputValue = e.target.value;
      const sanitizedValue = inputValue.replace(/^0+/, ""); // Remove leading zeros

      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: sanitizedValue,
      }));
      return;
    }

    //text/boolean/number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean !== null ? boolean : e.target.value, //want to check if null true or false
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    //Making sure they are numbers and not string
    if (+discountPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted Price needs to be less than Regular Price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are required");
      return;
    }

    let geolocation = {};
    let location;

    if (geolocationEnabled) {
      const realtorAPI_KEY = import.meta.env.VITE_REACT_APP_GEOCODE_API_KEY;

      const response = await fetch(
        `http://dev.virtualearth.net/REST/v1/Locations?query=${address}&key=${realtorAPI_KEY}`
      );

      const data = await response.json();

      // const formattedAddress = data.resourceSets[0].resources[0].address;
      // const fullAddress = JSON.stringify(formattedAddress)

      // const[Latitude, Longitude] = data.resourceSets[0].resources[0].geocodePoints.coordinates;

      if (
        data.resourceSets &&
        data.resourceSets.length > 0 &&
        data.resourceSets[0].resources &&
        data.resourceSets[0].resources.length > 0 &&
        data.resourceSets[0].resources[0].geocodePoints &&
        data.resourceSets[0].resources[0].geocodePoints.length > 0
      ) {
        geolocation.lat =
          data.resourceSets[0].resources[0].geocodePoints[0].coordinates[0] ||
          0;
        geolocation.long =
          data.resourceSets[0].resources[0].geocodePoints[0].coordinates[1] ||
          0;
      } else {
        setLoading(false);
        toast.error("Invalid response data or missing geolocation information");
      }
    } else {
      geolocation.lat = latitude;
      geolocation.long = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) =>
        storeImage(image).catch((error) => {
          setLoading(false);
          toast.error("Image not uploaded");
          return;
        })
      )
    );

    let formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timeStamp: serverTimestamp(),
    };

    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountPrice;

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
    setLoading(false);
    toast.success("List created successfully");
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="max-w-md px-2 mx-auto pt-4">
      <h1 className="text-3xl text-center font-bold mb-6">Create a Listing</h1>
      <form onSubmit={onSubmit}>
        <label className="text-lg font-semibold">Sell / Rent</label>
        <div className="flex justify-between gap-3 mb-6">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "!bg-slate-600 text-white"
            }`}
          >
            Sell
          </button>

          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "!bg-slate-600 text-white"
            }`}
          >
            Rent
          </button>
        </div>

        <label className="text-lg font-semibold">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          aria-required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />

        <div className="flex justify-between mb-6">
          <div>
            <label className="text-lg font-semibold">Beds</label>
            <input
              type="number"
              name="bedrooms"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              aria-required
              className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600"
            />
          </div>

          <div>
            <label className="text-lg font-semibold">Baths</label>
            <input
              type="number"
              name="bathrooms"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              aria-required
              className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600"
            />
          </div>
        </div>

        <label className="text-lg font-semibold">Parking Spot</label>
        <div className="flex justify-between gap-3 mb-6">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "!bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>

          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-white text-black" : "!bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <label className="text-lg font-semibold">Furnished</label>
        <div className="flex justify-between gap-3 mb-6">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "!bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>

          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "!bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <label className="text-lg font-semibold">Address</label>
        <textarea
          type="text"
          name="address"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          aria-required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />
        {!geolocationEnabled && (
          <div className="flex gap-3 mb-6">
            <div>
              <label className="text-lg font-semibold">Latitude</label>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                aria-required
                min="-90"
                max="90"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-grey-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>

            <div>
              <label className="text-lg font-semibold">Longitude</label>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                aria-required
                min="-180"
                max="180"
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-grey-300 rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center"
              />
            </div>
          </div>
        )}
        <label className="text-lg font-semibold">Description</label>
        <textarea
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Provide details about your listing..."
          required
          aria-required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />

        <label className="text-lg  font-semibold">Offer</label>
        <div className="flex justify-between gap-3 mb-6">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "!bg-slate-600 text-white"
            }`}
          >
            Yes
          </button>

          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "!bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <div>
          <div>
            <label className="text-lg font-semibold mb-6">Regular Price</label>
            <div className="flex justify-center items-center space-x-6 mb-6">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="4000000"
                required
                aria-required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 text-center"
              />
              {type === "rent" && (
                <div className="text-md w-full whitespace-nowrap"> $/month</div>
              )}
            </div>
          </div>
        </div>

        {offer === true && (
          <div>
            <div>
              <label className="text-lg font-semibold mb-6">
                Discounted Price
              </label>
              <div className="flex justify-center items-center space-x-6 mb-6">
                <input
                  type="number"
                  name="discountPrice"
                  id="discountPrice"
                  value={discountPrice}
                  onChange={onChange}
                  min="50"
                  max="4000000"
                  required={offer}
                  aria-required={offer}
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 text-center"
                />
                {type === "rent" && (
                  <div className="text-md w-full whitespace-nowrap">
                    {" "}
                    $/month
                  </div>
                )}{" "}
                {/* made it dynamic by using {" "} */}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="font-semibold text-lg block ">Images</label>
          <small className="text-gray-600">
            The first image will be the cover (max 6)
          </small>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg, .png,.jpeg"
            multiple
            required
            aria-required
            className="w-full text-gray-700 mt-3 border border-gray-300 bg-white rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>

        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-transparent active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Create Listing
        </button>
      </form>
    </main>
  );
}

export default CreateListing;
