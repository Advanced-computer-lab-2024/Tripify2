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
/* 
const salesData = [
    { type: "Ray Powell", price: 62350, quantity: 1, netProfit: 26810, grossProfit:29491 , date: "April 1, 2020" },
    { type: "Kathy's: Gelato cart", price: 10450, quantity: 1, netProfit: 4700, grossProfit: 5170, date: "April 6, 2020" },
    { type: "West Birchmont: Parks", price: 6000, quantity: 1, netProfit: 2500, grossProfit:2750 , date: "April 10, 2020" },
    { type: "Laredo: Assist Packages", price: 45900, quantity: 1, netProfit: 20000, grossProfit:22000 , date: "April 30, 2020" },
    { type: "Carl Percy", price: 51000, quantity: 1, netProfit: 17850, grossProfit:19635 , date: "April 15, 2020" },
    { type: "Penny Rozin", price: 30600, quantity: 1, netProfit: 10200, grossProfit: 11220, date: "April 20, 2020" },
];

// Calculate totals
const totalPrice = salesData.reduce((acc, item) => acc + item.price, 0);
const totalNetProfit = salesData.reduce((acc, item) => acc + item.netProfit, 0);
const totalGrossProfit = salesData.reduce((acc, item) => acc + item.grossProfit, 0);
 */
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
                                    <TableHead className="hidden md:table-cell">Quantity</TableHead>
                                    <TableHead className="hidden md:table-cell">Net Profit</TableHead>
                                    <TableHead className="hidden md:table-cell">Gross Profit</TableHead>
                                    <TableHead className="hidden md:table-cell">Date</TableHead>
                                </TableRow>
                            </TableHeader>
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
