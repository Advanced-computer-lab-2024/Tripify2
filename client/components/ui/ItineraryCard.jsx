"use client";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";

function ItineraryCard({
  Image,
  Name,
  StartDate,
  EndDate,
  Accessibility,
  Price,
  itinerary,
}) {
  const { currency } = useCurrencyStore();

  const dateStartDate = new Date(StartDate);
  const formattedStartDate = dateStartDate.toISOString().split("T")[0];

  const dateEndDate = new Date(EndDate);
  const formattedEndDate = dateEndDate.toISOString().split("T")[0];

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
          className= "w-16 h-16"
        />
      </li>
      <li>{Name}</li>
      <li>
        {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
        {convertPrice(Price, currency)}
      </li>
      <li>{formattedStartDate}</li>
      <li>{formattedEndDate}</li>
      <li className="justify-self-center">{Accessibility ? "✔️" : "✖️"}</li>
    </ul>
  );
}

export default ItineraryCard;
