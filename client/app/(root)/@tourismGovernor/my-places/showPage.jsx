"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";

import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { RiDeleteBin5Line } from "@remixicon/react";

const MyPlaces = ({ myPlaces }) => {
  //console.log(`myPlaces: ${myPlaces}`);
  const { currency } = useCurrencyStore();
  const router = useRouter();

  const [places, setPlaces] = useState();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDeleteClick = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this place?")) {
      setLoadingDelete(true);
      try {
        await fetcher(`/places/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPlaces(places.filter((place) => place._id !== id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDelete(false);
        router.refresh();
      }
    }
  };

  function redirectPlace(id) {
    router.push(`/${id}`);
  }

  const cards = myPlaces.length ? (
    myPlaces.map((place) => {
      let lowestPrice = Math.min(...Object.values(place?.TicketPrices || []));

      return (
        <>
          <hr />
          <button
            className="w-full hover:bg-slate-50"
            onClick={() => redirectPlace(place._id)}
            key={place._id}
          >
            <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
              <li className="w-16 h-16">
                <img
                  src={
                    place?.Pictures[0].startsWith("http") ||
                    place?.Pictures[0].startsWith("https") ||
                    place?.Pictures[0].startsWith("www") ||
                    place?.Pictures[0].startsWith("i.") ||
                    place?.Pictures[0].startsWith("m.")
                      ? place?.Pictures[0]
                      : `/images/placeholder.jpg`
                  }
                  className="w-16 h-16"
                />
              </li>
              <li>{place?.Name}</li>
              <li className="mr-2">
                From:{" "}
                {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}
                {convertPrice(lowestPrice, currency)}
              </li>
              <li className="ml-4">{place?.Type}</li>
              <RiDeleteBin5Line
                size={18}
                className="text-red-500 hover:text-red-600 transition duration-200 cursor-pointer justify-self-end"
                onClick={(e) => handleDeleteClick(e, place._id)}
              />
            </ul>
          </button>
        </>
      );
    })
  ) : (
    <p className="text-gray-600 text-center">No places created</p>
  );

  return (
    <div className="p-6">
      <div className="px-6 py-4 border-2 border-slate-200 rounded-md">
        <h1 className="text-2xl">
          <strong>My Places</strong>
        </h1>
        <span className="text-slate-400">View your places</span>
        <div className="mt-4">
          <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
            <li className="text-slate-600">Image</li>
            <li className="text-slate-600">Name</li>
            <li className="text-slate-600">Prices</li>
            <li className="text-slate-600 ml-4">Type</li>
          </ul>
          {cards}
        </div>
      </div>
    </div>
  );
};

export default MyPlaces;
