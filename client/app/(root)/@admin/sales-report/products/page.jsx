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
    const [products, setProducts] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(null); 


    useEffect(() => {
        const fetchAndSortData = async () => {
            const query = `/products?sort=createdAt&order=${sortOrder}`;
         
            try {
                const productsResponse = await fetcher(query);
      
                if (productsResponse?.ok) {
                    const productsData = await productsResponse.json();
                    setProducts(
                        filterByDateRange(sortByCreatedAt(productsData, null, sortOrder), selectedMonth)
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

    const totalSales = products.reduce(
        (totals, product) => {
            const price = product?.Price || 0;
            const totalSales = product?.TotalSales || 0;
            totals.totalSales += totalSales;
            totals.totalRevenue += price * totalSales;
            totals.discountedRevenue += price * totalSales * 0.1;
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
                  <ReactDatePicker
                    selected={selectedMonth} 
                    onChange={(date) => setSelectedMonth(date)}
                    dateFormat="MMMM yyyy" 
                    showMonthYearPicker 
                    className="input rounded-md"
                    placeholderText="Select Month"
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
                                {/* Products */}
                                <TableRow>
                                    <TableCell className="hidden sm:table-cell">
                                        <strong>Products</strong>
                                    </TableCell>
                                </TableRow>
                                {products?.map((product) =>
                                    product?._id ? (
                                        <TableRow key={product._id}>
                                            <TableCell className="hidden sm:table-cell">{product.Name}</TableCell>
                                            <TableCell className="hidden sm:table-cell">${product.Price}</TableCell>
                                            <TableCell>{product.TotalSales}</TableCell>
                                            <TableCell>${product.Price * product.TotalSales}</TableCell>
                                            <TableCell>${product.Price * product.TotalSales * 0.1}</TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {new Date(product?.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ) : null
                                )}
                                {/* Itineraries */}
                              
          
                                {/* Total Row */}
                                <TableRow>
                                    <TableCell className="hidden sm:table-cell">
                                        <strong>Total</strong>
                                    </TableCell>
                                    <TableCell>-</TableCell> {/* Empty cell for alignment */}
                                    <TableCell>
                                        <strong>{totalSales.totalSales }</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>${totalSales.totalRevenue}</strong>
                                    </TableCell>
                                    <TableCell>
                                        <strong>${totalSales.discountedRevenue }</strong>
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
