"use client";
import Dashboard from "@/components/ui/dashboard";
import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import datepicker styles
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
import SalesReportBtnP from "@/components/shared/SalesReportBtnP";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const [sortOrder, setSortOrder] = useState("desc"); // default is descending (newest first)
  const [acts, setActs] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null); 
  const session = useSession();

  useEffect(() => {
    const fetchAndSortData = async () => {
      const query3 = `/activities?sort=createdAt&order=${sortOrder}`;

      try {
        const actResponse = await fetcher(query3);

        if (actResponse?.ok) {
          const actData = await actResponse.json();
          const itinerariesWithParticipants = await Promise.all(
            actData.map(async (itin) => {
              const participantResponse = await fetcher(
                `/bookings/act/${itin._id}`
              );
              // console.log(itin._id)
              const participants = participantResponse?.ok
                ? await participantResponse.json()
                : [];
              // console.log(participants)
              return { ...itin, participants }; // Merge participants with the itinerary
            })
          );
          setActs(
            filterByDateRange(
              sortByCreatedAt(
                itinerariesWithParticipants,
                "ActivityId",
                sortOrder
              ),
              selectedMonth
            )
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAndSortData();
  }, [sortOrder, selectedMonth]); // Refetch and filter data when date range or sort order changes

  // Helper function to sort by createdAt for both flat and nested structures
  const sortByCreatedAt = (data, nestedKey, order) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(nestedKey ? a[nestedKey]?.createdAt : a.createdAt);
      const dateB = new Date(nestedKey ? b[nestedKey]?.createdAt : b.createdAt);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  // Helper function to filter data by a specific date range
  const filterByDateRange = (data, selectedMonth) => {
    if (!selectedMonth) return data; 
  
    const selectedYear = selectedMonth.getFullYear();
    const selectedMonthIndex = selectedMonth.getMonth(); 
  
    return data.filter((item) => {
      const createdAt = new Date(
        item?.ItineraryId?.createdAt ||
        item?.ActivityId?.createdAt ||
        item?.createdAt
      );
  
      console.log(`created at: ${createdAt.getFullYear}`)
      console.log(`created at: ${createdAt.getMonth}`)
      console.log(selectedYear)
      console.log(selectedMonth)
      return (
        createdAt.getFullYear() === selectedYear &&
        createdAt.getMonth() === selectedMonthIndex
      );
    });
  };
  
  

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
  };

  const totalSales3 = acts
    .filter((itin) =>session?.data?.user?.id=== itin?.AdvertiserId?._id  )
    .reduce(
      (totals, itin) => {
        const participants = itin?.participants?.Participants || 0;
        const price2 = itin.Price || 0;
        totals.totalSales += participants;
        totals.totalRevenue += (price2 * participants);
        totals.discountedRevenue += (price2 * participants * 0.9);
        return totals;
      },
      { totalSales: 0, totalRevenue: 0, discountedRevenue: 0 }
    );

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <SalesReportBtnP />
        </div>
      </div>
      <TabsContent className="mt-0" value="all">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div>Sales Report</div>
              <div className="flex gap-4 font-normal text-base">
                <div>
                  <ReactDatePicker
                    selected={selectedMonth} 
                    onChange={(date) => setSelectedMonth(date)}
                    dateFormat="MMMM yyyy" 
                    showMonthYearPicker 
                    className="input rounded-md"
                    placeholderText="Select Month"
                  />
                </div>
                <div>
                  <button
                    onClick={toggleSortOrder}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                  >
                    {sortOrder === "desc"
                      ? "Newest to Oldest"
                      : "Oldest to Newest"}
                  </button>
                </div>
              </div>
            </CardTitle>

            <CardDescription>View Activity Revenue Streams.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Total Participants
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Gross Profit
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Net Profit
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created At
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Activities */}
                <TableRow>
                  <TableCell className="hidden sm:table-cell">
                    <strong>Activities</strong>
                  </TableCell>
                </TableRow>
                {acts
                  ?.filter(
                    (booking) =>
                      session?.data?.user?.id === booking?.AdvertiserId?._id
                  )
                  .map((booking) =>
                    booking?._id ? (
                      <TableRow key={booking._id}>
                        <TableCell className="hidden sm:table-cell">
                          {booking.Name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          ${booking.Price || 0}
                        </TableCell>
                        <TableCell>
                          {booking?.participants?.Participants || 0}
                        </TableCell>
                        <TableCell>
                          $


                          {booking.Price  *
                            booking?.participants?.Participants}
                        </TableCell>
                        <TableCell>
                          $
                          {(booking.Price) *(booking?.participants?.Participants) *0.9}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(booking?.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ) : null
                  )}
                {/* Total Row */}
                <TableRow>
                  <TableCell className="hidden sm:table-cell">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell>-</TableCell> {/* Empty cell for alignment */}
                  <TableCell>
                    <strong>{totalSales3.totalSales}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>${totalSales3.totalRevenue}</strong>
                  </TableCell>
                  <TableCell>
                    <strong>${totalSales3.discountedRevenue}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
