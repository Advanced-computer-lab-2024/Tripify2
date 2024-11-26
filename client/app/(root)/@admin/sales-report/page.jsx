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


let query = '/products?'
if (query.endsWith("?")) query = '/products'
let query2 = '/bookings/itin?'
if (query2.endsWith("?")) query2 = '/bookings/itin'
let query3 = '/bookings/act?'
if (query3.endsWith("?")) query3 = '/bookings/act'

const productsResponse = await fetcher(query).catch(err => err)
let products = []
const itinResponse = await fetcher(query2).catch(err => err)
const session = await getSession()
const actResponse = await fetcher(query3).catch(err => err)

let itineraries=[]
let acts=[]
if (productsResponse?.ok) products = await productsResponse.json()
    if (itinResponse?.ok) itineraries = await itinResponse.json()
        if (actResponse?.ok) acts = await actResponse.json()


        const totalSales = products.reduce(
            (totals, product) => {
                const price = product?.Price || 0; // Default to 0 if undefined or null
                const totalSales = product?.TotalSales || 0; // Default to 0 if undefined or null
                
                // Accessing the associated itinerary data from the product

        
                // Update the totals with the correct values
                totals.totalSales += totalSales ;
                totals.totalRevenue += (price * totalSales) 
                totals.discountedRevenue += (price * totalSales * 0.1); // Assuming 10% discount on `product`
        
                return totals;
            },
            { totalSales: 0, totalRevenue: 0, discountedRevenue: 0 } // Initial totals
        );
        const totalSales2 = itineraries.reduce(
            (totals, itin) => {

                
                // Accessing the associated itinerary data from the product
                const itinerary = itin?.ItineraryId;
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
                <strong>Products</strong>
                </TableCell>
                </TableRow>
                            {products
            ?.map(product =>
                product?._id ? (
                    <TableRow key={product._id}>
                        <TableCell className="hidden sm:table-cell">
                            {product.Name}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                            ${product.Price}
                        </TableCell>
                        <TableCell>
                            {product.TotalSales}
                        </TableCell>
                        <TableCell>
                            ${product.Price * product.TotalSales}
                        </TableCell>
                        <TableCell>
                            ${product.Price * product.TotalSales * 0.1}
                        </TableCell>
                    </TableRow>
                ) : null
            )}
            {/* Bookings */}
            <TableRow>
                                    <TableCell className="hidden sm:table-cell">
                                        <strong>Itineraries</strong>
                                    </TableCell>
                                </TableRow>
                                {itineraries?.map(booking =>
                                    booking?._id ? (
                                        <TableRow key={booking._id}>
                                            <TableCell className="hidden sm:table-cell">
                                                {booking.ItineraryId?.Name || "Unknown"}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                ${booking.ItineraryId?.Price || 0}
                                            </TableCell>
                                            <TableCell>
                                                {booking.Participants || 0}
                                            </TableCell>
                                            <TableCell>
                                                ${booking.ItineraryId?.Price * booking.Participants || 0}
                                            </TableCell>
                                            <TableCell>
                                                ${booking.ItineraryId?.Price * booking.Participants * 0.1 || 0}
                                            </TableCell>
                                        </TableRow>
                                    ) : null
                                )}
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
                <strong>{totalSales.totalSales+totalSales2.totalSales+totalSales3.totalSales}</strong>
            </TableCell>
            <TableCell>
                <strong>${totalSales.totalRevenue+totalSales2.totalRevenue+totalSales3.totalRevenue}</strong>
            </TableCell>
            <TableCell>
                <strong>${totalSales.discountedRevenue+totalSales2.totalRevenue+totalSales3.totalRevenue}</strong>
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
