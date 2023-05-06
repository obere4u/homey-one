import React, { useState } from "react";

function CreateListing() {
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
    discountPrice
  } = formData;

  function onChange() {
    console.log("buy");
  }

  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold ">Create a Listing</h1>
      <form>
        <p className="text-lg mt-6 font-semibold">Sell or Rent</p>
        <div className="flex justify-between gap-3">
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

        <p className="text-lg mt-6 font-semibold">Name</p>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={onchange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          aria-required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />

        <div className="flex justify-between mb-6">
          <div>
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              name="bedrooms"
              id="bedrooms"
              value={bedrooms}
              onchange={onChange}
              min="1"
              max="50"
              required
              aria-required
              className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600"
            />
          </div>

          <div>
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              name="bathrooms"
              id="bathrooms"
              value={bathrooms}
              onchange={onChange}
              min="1"
              max="50"
              required
              aria-required
              className="w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600"
            />
          </div>
        </div>

        <p className="text-lg mt-6 font-semibold">Parking Spot</p>
        <div className="flex justify-between gap-3">
          <button
            type="button"
            id="type"
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

        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex justify-between gap-3">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "!bg-slate-600 text-white"
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
              !furnished ? "bg-white text-black" : "!bg-slate-600 text-white"
            }`}
          >
            No
          </button>
        </div>

        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea
          type="text"
          name="address"
          id="address"
          value={address}
          onChange={onchange}
          placeholder="Address"
          required
          aria-required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Description</p>
        <textarea
          type="text"
          name="description"
          id="description"
          value={description}
          onChange={onchange}
          placeholder="Describe your dream home"
          required
          aria-required
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-800 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg  font-semibold">Offer</p>
        <div className="flex justify-between gap-3 mb-6">
          <button
            type="button"
            id="type"
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
            <p className="text-lg font-semibold">Regular Price</p>
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
              <p className="text-lg font-semibold">Discounted Price</p>
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
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <p className="font-semibold text-lg ">Images</p>
          <small className="text-gray-600">
            The first image will be the cover (max-6)
          </small>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            className="w-full text-gray-700 mt-3 border border-gray-300 bg-white rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
          />
        </div>

        <button type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-transparentactive:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Create Listing</button>
      </form>
    </main>
  );
}

export default CreateListing;
