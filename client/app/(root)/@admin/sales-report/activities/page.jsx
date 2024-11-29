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
import SalesReportBtn from "@/components/admin/SalesReportBtn";
import { fetcher } from "@/lib/fetch-client";

export default function DashboardPage() {
    const [sortOrder, setSortOrder] = useState("desc"); // default is descending (newest first)

    const [acts, setActs] = useState([]);
    const [startDate, setStartDate] = useState(null); // Start date for filtering
    const [endDate, setEndDate] = useState(null); // End date for filtering

    useEffect(() => {
        const fetchAndSortData = async () => {

            const query3 = `/activities?sort=createdAt&order=${sortOrder}`;

            try {

                const actResponse = await fetcher(query3);

                if (actResponse?.ok) {
                    const actData = await actResponse.json();
                    const itinerariesWithParticipants = await Promise.all(actData.map(async (itin) => {
                        const participantResponse = await fetcher(`/bookings/act/${itin._id}`);
                        // console.log(itin._id)
                        const participants = participantResponse?.ok ? await participantResponse.json() : [];
                        // console.log(participants)
                        return { ...itin, participants }; // Merge participants with the itinerary
                    }));                    
                    setActs(
                        filterByDateRange(sortByCreatedAt(itinerariesWithParticipants, "ActivityId", sortOrder), startDate, endDate)
                    );
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAndSortData();
    }, [sortOrder, startDate, endDate]); // Refetch and filter data when date range or sort order changes

    // Helper function to sort by createdAt for both flat and nested structures
    const sortByCreatedAt = (data, nestedKey, order) => {
        return [...data].sort((a, b) => {
            const dateA = new Date(nestedKey ? a[nestedKey]?.createdAt : a.createdAt);
            const dateB = new Date(nestedKey ? b[nestedKey]?.createdAt : b.createdAt);
            return order === "asc" ? dateA - dateB : dateB - dateA;
        });
    };

    // Helper function to filter data by a specific date range
    const filterByDateRange = (data, start, end) => {
        return data.filter((item) => {
            const createdAt = new Date(
                item?.ActivityId?.createdAt 
            );

            const normalizedStart = start ? new Date(start.setHours(0, 0, 0, 0)) : null;
            const normalizedEnd = end ? new Date(end.setHours(23, 59, 59, 999)) : null;

            const isAfterStart = normalizedStart ? createdAt >= normalizedStart : true;
            const isBeforeEnd = normalizedEnd ? createdAt <= normalizedEnd : true;

            return isAfterStart && isBeforeEnd;
        });
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    };

   
    const totalSales3 = acts.reduce(
        (totals, itin) => {
            const itinerary = itin?.ActivityId;
            const participants = itin?.participants?.Participants || 0;
            const price2 = itin?.Price || 0;
            totals.totalSales += participants;
            totals.totalRevenue += price2 * participants;
            totals.discountedRevenue += price2 * participants * 0.1;
            return totals;
        },
        { totalSales: 0, totalRevenue: 0, discountedRevenue: 0 }
    );

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <SalesReportBtn />
                    <button onClick={toggleSortOrder}>
                        {sortOrder === "desc" ? "Sort: Newest to Oldest" : "Sort: Oldest to Newest"}
                    </button>
                </div>
            </div>
            <div className="flex gap-4 my-4">
                <div>
                    <label>Start Date</label>
                    <ReactDatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="input"
                        placeholderText="Select Start Date"
                    />
                </div>
                <div>
                    <label>End Date</label>
                    <ReactDatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="input"
                        placeholderText="Select End Date"
                    />
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Sales Report</CardTitle>
                        <CardDescription>View all Revenue Streams.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="hidden md:table-cell">Price</TableHead>
                                    <TableHead className="hidden md:table-cell">Total Sales</TableHead>
                                    <TableHead className="hidden md:table-cell">Gross Profit</TableHead>
                                    <TableHead className="hidden md:table-cell">Net Profit</TableHead>
                                    <TableHead className="hidden md:table-cell">Created At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               
                                {/* Activities */}
                                <TableRow>
                                    <TableCell className="hidden sm:table-cell">
                                        <strong>Activities</strong>
                                    </TableCell>
                                </TableRow>
                                {acts?.map((booking) =>
                                    booking?._id ? (
                                        <TableRow key={booking._id}>
                                            <TableCell className="hidden sm:table-cell">
                                                {booking?.Name}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                ${booking?.Price || 0}
                                            </TableCell>
                                            <TableCell>{booking?.participants?.Participants || 0}</TableCell>
                                            <TableCell>
                                                ${(booking?.Price || 0) * (booking?.participants?.Participants || 0)}
                                            </TableCell>
                                            <TableCell>
                                                ${(booking?.Price || 0) * (booking?.participants?.Participants || 0) * 0.1}
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
                                        <strong>${ totalSales3.totalRevenue}</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>${ totalSales3.discountedRevenue}</strong>
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
