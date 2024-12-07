"use client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { RiDeleteBin5Line, RiEdit2Line } from "@remixicon/react";
import { fetcher } from "@/lib/fetch-client";
import { useRouter } from "next/navigation";

function ItineraryCard({
  itineraryid,
  Image,
  Name,
  StartDate,
  EndDate,
  Accessibility,
  Price,
  itinerary,
}) {
  const { currency } = useCurrencyStore();

  const router = useRouter();

  const dateStartDate = new Date(StartDate);
  const formattedStartDate = dateStartDate.toISOString().split("T")[0];

  const dateEndDate = new Date(EndDate);
  const formattedEndDate = dateEndDate.toISOString().split("T")[0];

  //console.log(`itineraryId: ${itineraryid}`);

  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (confirmed) {
      try {
        const response = await fetcher(`/itineraries/${itineraryid}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          alert("Itinerary deleted successfully!");
          router.refresh();
        } else {
          alert("Failed to delete the itinerary.");
        }
      } catch (error) {
        console.error("Error deleting itinerary:", error);
        alert("An error occurred while deleting the itinerary.");
      }
    }
  };

  return (
    <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
      <li className="w-16 h-16">
        <img
          src={
            itinerary?.Image.startsWith("http") ||
            itinerary?.Image.startsWith("https") ||
            itinerary?.Image.startsWith("www") ||
            itinerary?.Image.startsWith("i.") ||
            itinerary?.Image.startsWith("m.")
              ? itinerary?.Image
              : `/images/placeholder.jpg`
          }
          className="w-16 h-16"
        />
      </li>
      <li>{Name}</li>
      <li>
        {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
        {convertPrice(Price, currency)}
      </li>
      <li>{formattedStartDate}</li>
      <li>{formattedEndDate}</li>
      <RiDeleteBin5Line
        size={18}
        className="text-red-500 hover:text-red-600 transition duration-200 cursor-pointer justify-self-end"
        onClick={(e) => handleDeleteClick(e)}
      />
    </ul>
  );
}

export default ItineraryCard;
