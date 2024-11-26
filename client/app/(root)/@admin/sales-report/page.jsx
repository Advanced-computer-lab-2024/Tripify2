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
let query2 = '/itineraries?'
if (query2.endsWith("?")) query2 = '/itineraries'
const productsResponse = await fetcher(query).catch(err => err)
let products = []
const session = await getSession()
let itineraries=[]
if (productsResponse?.ok) products = await productsResponse.json()

    const totalSales = products
    ?.filter(product => product?.Seller?._id === session?.user?.userId)
    .reduce(
        (totals, product) => {
            if (product?._id) {
                totals.totalSales += product.TotalSales || 0;
                totals.totalRevenue += product.Price * product.TotalSales || 0;
                totals.discountedRevenue += product.Price * product.TotalSales * 0.1 || 0;
            }
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
        <TableRow>
            <TableCell className="hidden sm:table-cell">
                <strong>Total</strong>
            </TableCell>
            <TableCell>-</TableCell> {/* Empty cell for alignment */}
            <TableCell>
                <strong>{totalSales.totalSales}</strong>
            </TableCell>
            <TableCell>
                <strong>${totalSales.totalRevenue}</strong>
            </TableCell>
            <TableCell>
                <strong>${totalSales.discountedRevenue}</strong>
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
