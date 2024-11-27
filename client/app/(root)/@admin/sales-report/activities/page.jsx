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
import { fetcher } from "@/lib/fetch-client"
import { getSession } from "@/lib/session"



let query3 = '/bookings/act?'
if (query3.endsWith("?")) query3 = '/bookings/act'

const session = await getSession()
const actResponse = await fetcher(query3).catch(err => err)

let acts=[]
        if (actResponse?.ok) acts = await actResponse.json()


 
        const totalSales3 = acts.reduce(
            (totals, itin) => {

                
                // Accessing the associated itinerary data from the product
                const itinerary = itin?.ActivityId;
                const participants = itin?.Participants || 0; // Default to 0 if undefined or null
                const price2 = itinerary?.Price || 0; // Default to 0 if undefined or null
        
                // Update the totals with the correct values
                totals.totalSales +=   participants;
                totals.totalRevenue +=  (price2 * participants);
                totals.discountedRevenue += (price2 * participants * 0.1); // Assuming 10% discount on `product`
        
                return totals;
            },
            { totalSales: 0, totalRevenue: 0, discountedRevenue: 0 } // Initial totals
        );
        
export default function DashboardPage() {
    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                    <SalesReportBtn />
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
             
                                            <TableRow>
                                    <TableCell className="hidden sm:table-cell">
                                        <strong>Activities</strong>
                                    </TableCell>
                                </TableRow>
                                {acts?.map(booking =>
                                    booking?._id ? (
                                        <TableRow key={booking._id}>
                                            <TableCell className="hidden sm:table-cell">
                                                {booking.ActivityId?.Name || "Unknown"}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                ${booking.ActivityId?.Price || 0}
                                            </TableCell>
                                            <TableCell>
                                                {booking.Participants || 0}
                                            </TableCell>
                                            <TableCell>
                                                ${booking.ActivityId?.Price * booking.Participants || 0}
                                            </TableCell>
                                            <TableCell>
                                                ${booking.ActivityId?.Price * booking.Participants * 0.1 || 0}
                                            </TableCell>
                                        </TableRow>
                                    ) : null
                                )}
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
                           {/*  <TableBody>
                                {salesData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell className="hidden md:table-cell">${item.price.toLocaleString()}</TableCell>
                                        <TableCell className="hidden md:table-cell">{item.quantity}</TableCell>
                                        <TableCell className="hidden md:table-cell">${item.netProfit.toLocaleString()}</TableCell>
                                        <TableCell className="hidden md:table-cell">${item.grossProfit.toLocaleString()}</TableCell>
                                        <TableCell className="hidden md:table-cell">{item.date}</TableCell>
                                    </TableRow>
                                ))}
                                {/* Add the total row */}
                          {/*       <TableRow className="font-bold">
                                    <TableCell>Total</TableCell>
                                    <TableCell className="hidden md:table-cell">${totalPrice.toLocaleString()}</TableCell>
                                    <TableCell className="hidden md:table-cell">-</TableCell>
                                    <TableCell className="hidden md:table-cell">${totalNetProfit.toLocaleString()}</TableCell>
                                    <TableCell className="hidden md:table-cell">${totalGrossProfit.toLocaleString()}</TableCell>
                                    <TableCell className="hidden md:table-cell">-</TableCell>
                                </TableRow> */}
                        {/*     </TableBody> */}
                        </Table> 
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
