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
    const [selectedMonth, setSelectedMonth] = useState(null); // Single month for filtering
    const session = useSession();

    useEffect(() => {
        const fetchAndSortData = async () => {
            const query2 = `/activities?sort=createdAt&order=${sortOrder}`;
    
            try {
                const itinResponse = await fetcher(query2);
                if (itinResponse?.ok) {
                    const itinData = await itinResponse.json();
                    const itinerariesWithParticipants = await Promise.all(
                        itinData.map(async (itin) => {
                            // Fetch all participants without filtering first
                            const participantResponse = await fetcher(`/bookings/act/${itin._id}`);
                            const participants = participantResponse?.ok ? await participantResponse.json() : 0;
                            const totalParticipants = participants.Participants;

                            // Apply the single date filter if a date is selected
                            const filteredParticipants = selectedMonth
                                ? await getParticipantsByDate(itin._id, selectedMonth)
                                : totalParticipants;
                            // console.log(`participants:${filteredParticipants}`)


                            return { 
                                ...itin, 
                                participants: filteredParticipants,
                                totalParticipants: totalParticipants // Save the total number of participants
                            };

                        })
                    );

                    setItineraries(itinerariesWithParticipants);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchAndSortData();
    }, [sortOrder, selectedMonth]);
    
    // Fetch participants based on a single filter date
    const getParticipantsByDate = async (itinId, month) => {
        if (!month) return 0;
    
        const year = month.getFullYear();
        const monthNumber = month.getMonth() + 1;
    
        const url = `/bookings/act/${itinId}/month/${monthNumber}/year/${year}`;
        // console.log(`Generated URL: ${url}`);
        
        try {
            const response = await fetcher(url);
            if (response?.ok) {
                const participants = await response.json();
                console.log(`Participants: ${participants.Participants}`);
                return participants.Participants || 0;
            }
        } catch (error) {
            console.error("Error fetching participants by month:", error);
        }
    
        return 0;
    };
    

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toISOString().split('T')[0]; // Format date to 'YYYY-MM-DD'
    };

    const toggleSortOrder = () => {
        setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    };

    const totalParticipants = itineraries
        .filter((itin) => itin?.TourGuide?._id === session?.data?.user?.id)
        .reduce((totals, itin) => {
            const participants = itin?.participants|| 0;
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
                    <label>Select Month</label>
                    <ReactDatePicker
                        selected={selectedMonth}
                        onChange={(date) => {
                            date.setHours(0, 0, 0, 0); // Reset time to midnight
                            setSelectedMonth(date);
                        }}                        
                        dateFormat="yyyy-MM"
                        className="input"
                        placeholderText="Select Month"
                        showMonthYearPicker // Enables month/year picker
                    />
                </div>
            </div>
            <TabsContent value="all">
                <Card>
                    <CardHeader>
                        <CardTitle>Tourists Report</CardTitle>
                        <CardDescription>View all Tourists who Used your Activities.</CardDescription>
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
                                {itineraries
                                    .filter((itin) => session?.data?.user?.id === itin?.AdvertiserId?._id)
                                    .map((itin) =>
                                        itin?._id ? (
                                            <TableRow key={itin._id}>
                                                <TableCell className="hidden sm:table-cell">
                                                    {itin.Name}
                                                </TableCell>
                                                {console.log(`inside html comp:${itin?.participants}`)}
                                                <TableCell>{itin?.participants || 0}</TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {formatDate(itin?.createdAt)}
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
