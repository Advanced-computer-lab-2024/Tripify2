'use client';

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
import {
    Tabs,
    TabsContent,
} from "@/components/ui/tabs";
import SalesReportBtnP from "@/components/shared/SalesReportBtnP";
import { fetcher } from "@/lib/fetch-client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
    const [sortOrder, setSortOrder] = useState("desc"); // default is descending (newest first)
    const [itineraries, setItineraries] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null); 
    const session=useSession()
    useEffect(() => {
        const fetchAndSortData = async () => {
            const query2 = `/itineraries?sort=createdAt&order=${sortOrder}`;

            try {
                const itinResponse = await fetcher(query2);
                if (itinResponse?.ok) {
                    const itinData = await itinResponse.json();
                    const itinerariesWithParticipants = await Promise.all(itinData.map(async (itin) => {
                        const participantResponse = await fetcher(`/bookings/itin/${itin._id}`);
                        // console.log(itin._id)
                        const participants = participantResponse?.ok ? await participantResponse.json() : [];
                        // console.log(participants)
                        return { ...itin, participants }; // Merge participants with the itinerary
                    }));
    
                    setItineraries(
                        filterByDateRange(sortByCreatedAt(itinerariesWithParticipants, "ItineraryId", sortOrder), selectedMonth )
                    );
                    // console.log(itinerariesWithParticipants)
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



    const totalSales2 = itineraries
    .filter((itin) => itin?.TourGuide?._id === session?.data?.user?.id) // Filter itineraries by TourGuide ID
    .reduce(
        (totals, itin) => {
            const participants = itin?.participants?.Participants || 0;
            const price2 = itin?.Price || 0;
            totals.totalSales += participants;
            totals.totalRevenue += price2 * participants;
            totals.discountedRevenue += price2 * participants * 0.9;
            return totals;
        },
        { totalSales: 0, totalRevenue: 0, discountedRevenue: 0 }
    );




    return (
        <Tabs defaultValue="all" className="p-4 px-8">
            <div className="flex flex-row justify-between">
                <div className="flex gap-4 my-4">

                </div>
                <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
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
                        <SalesReportBtnP />
                            <div className="mr-2">Sort</div>
                            <select className="rounded" onChange={toggleSortOrder}>
                                <option value="desc">Newest to Oldest</option>
                                <option value="asc">Oldest to Newest</option>
                            </select>
                    </div>
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Sales Report</CardTitle>
                        <CardDescription>View Itinerary Revenue Streams.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead className="hidden md:table-cell">Total Participants</TableHead>
                                    <TableHead className="hidden md:table-cell">Gross Profit</TableHead>
                                    <TableHead className="hidden md:table-cell">Net Profit</TableHead>
                                    <TableHead className="hidden md:table-cell">Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>


                                {/* Itineraries */}
                                <TableRow>
                                    <TableCell className="hidden sm:table-cell">
                                        <strong>Itineraries</strong>
                                    </TableCell>
                                </TableRow>
                                {itineraries?.filter((booking)=> session?.data?.user?.id===booking?.TourGuide?._id )
                                .map((booking) =>
                                    booking?._id ? (
                                        <TableRow key={booking._id}>
                                            <TableCell className="hidden sm:table-cell">
                                                {booking.Name}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                ${booking.Price || 0}
                                            </TableCell>
                                            <TableCell>{booking?.participants?.Participants || 0}</TableCell>
                                            <TableCell>
                                                ${(booking.Price || 0) * (booking?.participants?.Participants || 0)}
                                            </TableCell>
                                            <TableCell>
                                                ${((booking.Price || 0) * (booking?.participants?.Participants || 0) * 0.9).toFixed(2)}
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
                                        <strong>{totalSales2.totalSales}</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>${(totalSales2.totalRevenue).toFixed(2)}</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>${ (totalSales2.discountedRevenue).toFixed(2)}</strong>
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
