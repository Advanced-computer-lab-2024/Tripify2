"use client";
import { useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [sorted, setSorted] = useState(false);

  useEffect(() => {
    const activitiesWithBookingsToShow = selectedDate
      ? activitiesWithBookings.filter((booking) => {
          const date = new Date(booking?.createdAt);
          const theMonth = date.getMonth();
          const theYear = date.getFullYear();
          return (
            theMonth === selectedDate.getMonth() &&
            theYear === selectedDate.getFullYear()
          );
        })
      : activitiesWithBookings;

    const uniqueActivityIds = new Set();

    const activitiesNotShownWithBookings = activitiesWithBookings.filter(
      (booking) => {
        const activityId = booking?.ActivityId?._id;

        const isNotInShown = !activitiesWithBookingsToShow.some(
          (shownBooking) =>
            shownBooking?.ActivityId?._id === booking?.ActivityId?._id
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
  }, [selectedDate, activitiesWithBookings, activitiesWithoutBookings]);

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
                <ReactDatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="input rounded-md"
                  placeholderText="Select Month"
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
                {activities.map((booking, index) => (
                  <TableRow key={index}>
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
