"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";

const HelperTouristsReport = ({ params }) => {
  const { itinerariesWithBookings, itinerariesWithoutBookings } = params;

  const [itineraries, setItineraries] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const itinerariesWithBookingsToShow = selectedMonth
      ? itinerariesWithBookings.filter((booking) => {
          const date = new Date(booking?.createdAt);
          const theMonth = date.getMonth();
          return theMonth === selectedMonth.getMonth();
        })
      : itinerariesWithBookings;

    const uniqueItineraryIds = new Set();

    const itinerariesNotShownWithBookings = itinerariesWithBookings.filter(
      (booking) => {
        const itineraryId = booking?.ItineraryId?._id;

        const isNotInShown = !itinerariesWithBookingsToShow.some(
          (shownBooking) =>
            shownBooking?.ItineraryId?._id === booking?.ItineraryId?._id
        );

        const isItineraryUnique = !uniqueItineraryIds.has(itineraryId);

        if (isNotInShown && isItineraryUnique) {
          uniqueItineraryIds.add(itineraryId);
          return true;
        }
        return false;
      }
    );

    setItineraries([
      ...itinerariesWithoutBookings.map((itinerary) => ({
        name: itinerary?.Name,
        bookingsCount: 0,
      })),
      ...itinerariesNotShownWithBookings.map((itinerary) => ({
        name: itinerary?.ItineraryId?.Name,
        bookingsCount: 0,
      })),
      ...itinerariesWithBookingsToShow.reduce((accumulating, booking) => {
        const itinerary = accumulating.find(
          (element) => element?.name === booking?.ItineraryId?.Name
        );
        itinerary
          ? (itinerary.bookingsCount += booking?.Participants)
          : accumulating.push({
              name: booking?.ItineraryId?.Name,
              bookingsCount: booking?.Participants,
            });
        return accumulating;
      }, []),
    ]);
  }, [selectedMonth, itinerariesWithBookings, itinerariesWithoutBookings]);

  const sortItineraries = () => {
    const sortedItineraries = [...itineraries].sort((a, b) => {
      if (sorted) return a.bookingsCount - b.bookingsCount;
      return b.bookingsCount - a.bookingsCount;
    });
    setSorted((prev) => !prev);
    setItineraries(sortedItineraries);
  };

  const total = itineraries.reduce(
    (sum, itinerary) => sum + itinerary.bookingsCount,
    0
  );

  return (
    <Tabs defaultValue="all">
      <TabsContent className="mt-0" value="all">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Itineraries Activity Report</div>
              <div className="flex gap-4 font-normal text-base">
                <DatePicker
                  selected={selectedMonth}
                  onChange={(date) => setSelectedMonth(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="Select a month"
                  className="input rounded-md"
                />
                <button
                  onClick={sortItineraries}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                  {sorted ? "Sort Ascendingly" : "Sort Descendingly"}
                </button>
              </div>
            </CardTitle>
            <CardDescription>
              Track revenue and booking performance for each itinerary.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Participants
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="hidden sm:table-cell">
                    <strong>Itineraries</strong>
                  </TableCell>
                </TableRow>
                {itineraries.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="hidden sm:table-cell">
                      {booking.name}
                    </TableCell>
                    <TableCell>{booking?.bookingsCount}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="hidden sm:table-cell">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{total}</strong>
                  </TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default HelperTouristsReport;
