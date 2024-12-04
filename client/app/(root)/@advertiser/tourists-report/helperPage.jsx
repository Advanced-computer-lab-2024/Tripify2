"use client";
import { useEffect, useState } from "react";
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
  const { activitiesWithBookings, activitiesWithoutBookings } = params;

  const [activities, setActivities] = useState([]);
  const [month, setMonth] = useState("");
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const activitiesWithBookingsToShow = month
      ? activitiesWithBookings.filter((booking) => {
          const date = new Date(booking?.createdAt);
          const theMonth = date.getMonth();
          return theMonth === parseInt(month) - 1;
        })
      : activitiesWithBookings;

    const uniqueActivityIds = new Set();

    const activitiesNotShownWithBookings = activitiesWithBookings.filter(
      (booking) => {
        const activityId = booking?.ActivityId?._id;

        const isNotInShown = !activitiesWithBookingsToShow.some(
          (shownBooking) =>
            /* shownBooking?._id === booking?._id */ shownBooking?.ActivityId
              ?._id === booking?.ActivityId?._id
        );

        const isActivityUnique = !uniqueActivityIds.has(activityId);

        if (isNotInShown && isActivityUnique) {
          uniqueActivityIds.add(activityId);
          return true;
        }
        return false;
      }
    );

    setActivities([
      ...activitiesWithoutBookings.map((activity) => ({
        name: activity?.Name,
        bookingsCount: 0,
      })),
      ...activitiesNotShownWithBookings.map((activity) => ({
        name: activity?.ActivityId?.Name,
        bookingsCount: 0,
      })),
      ...activitiesWithBookingsToShow.reduce((accumulating, booking) => {
        const activity = accumulating.find(
          (element) => element?.name === booking?.ActivityId?.Name
        );
        activity
          ? (activity.bookingsCount += booking?.Participants)
          : accumulating.push({
              name: booking?.ActivityId?.Name,
              bookingsCount: booking?.Participants,
            });
        return accumulating;
      }, []),
    ]);
  }, [month, activitiesWithBookings, activitiesWithoutBookings]);

  const handleMonthChange = (e) => {
    if (parseInt(e.target.value) > 12 || parseInt(e.target.value) < 1)
      alert("Please enter a valid month");
    else setMonth(e.target.value);
  };

  const sortActivities = () => {
    const sortedActivities = [...activities].sort((a, b) => {
      if (sorted) return a.bookingsCount - b.bookingsCount;
      return b.bookingsCount - a.bookingsCount;
    });
    setSorted((prev) => !prev);
    setActivities(sortedActivities);
  };

  const total = activities.reduce(
    (sum, activity) => sum + activity.bookingsCount,
    0
  );

  return (
    <Tabs defaultValue="all">
      <TabsContent className="mt-0" value="all">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Activities Activity Report</div>
              <div className="flex gap-4 font-normal text-base">
                <input
                  value={month}
                  onChange={handleMonthChange}
                  placeholder="Enter a month (1-12)"
                  className="input rounded-md"
                />
                <button
                  onClick={sortActivities}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                  {sorted ? "Sort Ascendingly" : "Sort Descendingly"}
                </button>
              </div>
            </CardTitle>
            <CardDescription>
              Track revenue and booking performance for each activity.
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
                    <strong>Activities</strong>
                  </TableCell>
                </TableRow>
                {activities.map((booking) => (
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
