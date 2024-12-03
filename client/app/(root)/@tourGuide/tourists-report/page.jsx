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
    const [startDate, setStartDate] = useState(null); // Start date for filtering
    const [endDate, setEndDate] = useState(null); // End date for filtering
    const session = useSession();

    useEffect(() => {
        const fetchAndSortData = async () => {
            const query2 = `/itineraries?sort=createdAt&order=${sortOrder}`;

            try {
                const itinResponse = await fetcher(query2);
                if (itinResponse?.ok) {
                    const itinData = await itinResponse.json();
                    const itinerariesWithParticipants = await Promise.all(itinData.map(async (itin) => {
                        // Fetch all participants first (no date filter)
                        const participantResponse = await fetcher(`/bookings/itin/${itin._id}`);
                        const participants = participantResponse?.ok ? await participantResponse.json() : [];
                        const totalParticipants = participants.length; // Total participants for the itinerary
                        
                        // Apply the date filter if dates are set
                        let filteredParticipants = await getParticipantsByDateRange(itin._id, startDate, endDate);
                        if (filteredParticipants==[]) {
                            filteredParticipants=participants;
                        }
                        return { 
                            ...itin, 
                            participants: filteredParticipants, 
                            totalParticipants: totalParticipants // Save the total number of participants
                        };
                    }));

                    // Apply sorting after fetching
                    setItineraries(itinerariesWithParticipants);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAndSortData();
    }, [sortOrder, startDate, endDate]); // Refetch and filter data when date range or sort order changes

    // Fetch participants based on booking's createdAt date
    const getParticipantsByDateRange = async (itinId, startDate, endDate) => {
        let url = `/bookings/itin/${itinId}/created-at/`;

        // Filter by start date
        if (startDate && !endDate) {
            const startDateStr = startDate.toISOString();
            url += `${startDateStr}`;
        }
        // Filter by end date
        else if (!startDate && endDate) {
            const endDateStr = endDate.toISOString();
            url += `${endDateStr}`;
        }
        // Filter by both start and end date
        else if (startDate && endDate) {
            const startDateStr = startDate.toISOString();
            const endDateStr = endDate.toISOString();
            url += `${startDateStr}/${endDateStr}`;
        } else {
            return []; // If no dates are specified, return an empty array
        }

        const response = await fetcher(url);

        if (response?.ok) {
            const participants = await response.json();
            return participants; // Return participants for this itinerary within the date range
        }
        return []; // Return empty if no participants found or error
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    };

    // Calculate total participants, considering date filter
    const totalParticipants = itineraries
        .filter((itin) => itin?.TourGuide?._id === session?.data?.user?.id) // Filter itineraries by TourGuide ID
        .reduce((totals, itin) => {
            const participants = itin?.participants?.length || 0;
            totals.totalParticipants += participants;
            return totals;
        }, { totalParticipants: 0 });

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <SalesReportBtnP />
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
                                    <TableHead className="hidden md:table-cell">Total Participants</TableHead>
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
                                {itineraries
                                    .filter((booking) => session?.data?.user?.id === booking?.TourGuide?._id)
                                    .map((booking) =>
                                        booking?._id ? (
                                            <TableRow key={booking._id}>
                                                <TableCell className="hidden sm:table-cell">
                                                    {booking.Name}
                                                </TableCell>
                                                <TableCell>{booking?.participants?.length || booking?.totalParticipants || 0}</TableCell>
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
                                    <TableCell>
                                        <strong>{totalParticipants.totalParticipants}</strong>
                                    </TableCell>
                                    <TableCell>-</TableCell> {/* Empty cell for alignment */}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
