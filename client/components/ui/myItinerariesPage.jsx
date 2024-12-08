"use client";
import React from "react";
import ItineraryCard from "./itineraryCard";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertPrice } from "@/lib/utils";
import { useCurrencyStore } from "@/providers/CurrencyProvider";
import { RiDeleteBin5Line, RiEdit2Line } from "@remixicon/react";
import { fetcher } from "@/lib/fetch-client";

function MyItinerariesPage({ Itineraries }) {
  const router = useRouter();
  function redirectitinerary(id) {
    router.push(`/myitineraries/${id}`);
  }
  const AllItineraries = Itineraries;

  const { currency } = useCurrencyStore();

  // const cards = AllItineraries.map((itinerary) => (
  //   <>
  //     <hr />
  //     <button
  //       className="w-full hover:bg-slate-50"
  //       onClick={() => redirectitinerary(itinerary._id)}
  //       key={itinerary._id}
  //     >
  //       <ItineraryCard
  //         itineraryid={itinerary._id}
  //         Name={itinerary.Name}
  //         Accessibility={itinerary.Accessibility}
  //         Image={itinerary.Image}
  //         StartDate={itinerary.StartDate}
  //         EndDate={itinerary.EndDate}
  //         Price={itinerary.Price}
  //         itinerary={itinerary}
  //       />
  //     </button>
  //   </>
  // ));
  // return (
  //   <div className="p-6">
  //     <div className="px-6 py-4 border-2 border-slate-200 rounded-md">
  //       <h1 className="text-2xl">
  //         <strong>My Itineraries</strong>
  //       </h1>
  //       <span className="text-slate-400">View your itineraries</span>
  //       <div className="mt-4">
  //         <ul className="grid grid-cols-[100px_300px_100px_300px_300px_100px] justify-items-start p-2 items-center">
  //           <li className="text-slate-600">Image</li>
  //           <li className="text-slate-600">Name</li>
  //           <li className="text-slate-600">Price</li>
  //           <li className="text-slate-600">Start Date</li>
  //           <li className="text-slate-600">End Date</li>
  //         </ul>
  //         {cards}
  //       </div>
  //     </div>
  //   </div>
  // );

  //console.log(`itineraryId: ${itineraryid}`);

  const handleDeleteClick = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = confirm(
      "Are you sure you want to delete this itinerary?"
    );
    if (confirmed) {
      try {
        const response = await fetcher(`/itineraries/${id}`, {
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
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Itineraries</CardTitle>
        <CardDescription>
          View all your itineraries currently on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AllItineraries.map((itinerary) => (
              <TableRow
                key={itinerary?._id}
                onClick={() => router.push(`/myitineraries/${itinerary?._id}`)}
              >
                <TableCell className="hidden sm:table-cell">
                  <img
                    src={
                      itinerary?.Image.startsWith("http://") ||
                      itinerary?.Image.startsWith("https://") ||
                      itinerary?.Image.startsWith("www") ||
                      itinerary?.Image.startsWith("i.") ||
                      itinerary?.Image.startsWith("m.")
                        ? itinerary?.Image
                        : `/images/${itinerary?.Image}`
                    }
                    width={50}
                    height={50}
                    alt={itinerary?.Name}
                  />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {itinerary?.Name}
                </TableCell>

                <TableCell className="font-medium">
                  {currency === "USD" ? "$" : currency === "EUR" ? "€" : "EGP"}{" "}
                  {convertPrice(itinerary?.Price, currency)}
                </TableCell>
                <TableCell className="font-medium">
                  {(() => {
                    const dateStartDate = new Date(itinerary?.StartDate);
                    const formattedStartDate = dateStartDate.toISOString().split("T")[0];
                    return formattedStartDate;
                  })()}
                </TableCell>
                <TableCell className="font-medium">
                  {(() => {
                    const dateEndDate = new Date(itinerary?.EndDate);
                    const formattedEndDate = dateEndDate.toISOString().split("T")[0];
                    return formattedEndDate;
                  })()}
                </TableCell>
                <TableCell className="font-medium">
                  <RiDeleteBin5Line
                    size={18}
                    className="text-red-500 hover:text-red-600 transition duration-200 cursor-pointer justify-self-end"
                    onClick={(e) => handleDeleteClick(e, itinerary._id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
export default MyItinerariesPage;
