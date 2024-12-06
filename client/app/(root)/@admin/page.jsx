'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetcher } from '@/lib/fetch-client';
import DeleteUserBtn from '@/components/admin/DeleteUserBtn';

export default function DashboardPage() {
    const [advertisers, setAdvertisers] = useState([]);
    const [tourists, setTourists] = useState([]);
    const [tourguides, setTourguides] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [tourismGovernors, setTourismGovernors] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState(null); 


    useEffect(() => {
        const fetchAndSortData = async () => {
            const queries = [
                { url: '/advertisers?accepted=true', setter: setAdvertisers },
                { url: '/tourists', setter: setTourists },
                { url: '/tourguides?accepted=true', setter: setTourguides },
                { url: '/sellers?accepted=true', setter: setSellers },
                { url: '/tourism-governors', setter: setTourismGovernors }
            ];

            try {
                for (const { url, setter } of queries) {
                    const response = await fetcher(url);
                    if (response?.ok) {
                        const data = await response.json();
                        const filteredData = filterByDateRange(data, selectedMonth);
                        setter(filteredData);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchAndSortData();
    }, [selectedMonth]);
    const filterByDateRange = (data,selectedMonth ) => {
        return data.filter((item) => {
            if (!selectedMonth) return data; 
  
            const selectedYear = selectedMonth.getFullYear();
            const selectedMonthIndex = selectedMonth.getMonth();
            const createdAt = new Date(item?.UserId?.createdAt || item?.createdAt);
            return (
                createdAt.getFullYear() === selectedYear &&
                createdAt.getMonth() === selectedMonthIndex
              );
            });
          };

    const allUsers = [...advertisers, ...tourists, ...tourguides, ...sellers, ...tourismGovernors];
    const totalUsers = allUsers.length;

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="advertisers">Advertisers</TabsTrigger>
                    <TabsTrigger value="tourists">Tourists</TabsTrigger>
                    <TabsTrigger value="tourguides">Tourguides</TabsTrigger>
                    <TabsTrigger value="sellers">Sellers</TabsTrigger>
                    <TabsTrigger value="tourismGovernors">Tourism Governors</TabsTrigger>
                </TabsList>
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
  
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            View all users currently accepted on the platform.
                            Total Users: {totalUsers}
                        </CardDescription>
                        
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                   
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Email
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Role
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created at
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allUsers.sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
                                    <TableRow key={user?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {user?.UserId?.UserName}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.UserId?.Email}
                                        </TableCell>
                                        <TableCell>
                                            {user?.UserId?.Role}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                        {new Date(user?.UserId?.createdAt).toLocaleDateString()}

                                        </TableCell>
                                        <TableCell>
                                        
                                            <DeleteUserBtn user={user} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>
                   
                </Card>
            </TabsContent>
            <TabsContent value="advertisers">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Advertisers</CardTitle>
                        <CardDescription>
                            View all advertisers currently accepted on the platform.
                            Total Users: {[...advertisers].length}

                        </CardDescription>
                    </CardHeader>
                    <CardContent>
 <Table>
                            <TableHeader>
                                <TableRow>
                                   
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Email
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Role
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created at
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                            {[...advertisers].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
                                    <TableRow key={user?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {user?.UserId?.UserName}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.UserId?.Email}
                                        </TableCell>
                                        <TableCell>
                                            {user?.UserId?.Role}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                        {new Date(user?.UserId?.createdAt).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                       
                                        
                                            <DeleteUserBtn user={user} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {/* <CardFooter>
                        <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        products
                        </div>
                    </CardFooter> */}
                </Card>
            </TabsContent>
            <TabsContent value="tourists">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Tourists</CardTitle>
                        <CardDescription>
                            View all tourists currently on the platform.
                            Total Users: {[...tourists].length}

                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead> */}
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Email
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Role
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created at
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[ ...tourists].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
                                    <TableRow key={user?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {user?.UserId?.UserName}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.UserId?.Email}
                                        </TableCell>
                                        <TableCell>
                                            {user?.UserId?.Role}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                        {new Date(user?.UserId?.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>                                     
                                            <DeleteUserBtn user={user} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="tourguides">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Tourguides</CardTitle>
                        <CardDescription>
                            View all tourguides currently accepted on the platform.
                            Total Users: {[...tourguides].length}

                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>

                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Email
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Role
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created at
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[ ...tourguides].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
                                    <TableRow key={user?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {user?.UserId?.UserName}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.UserId?.Email}
                                        </TableCell>
                                        <TableCell>
                                            {user?.UserId?.Role}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                        {new Date(user?.UserId?.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>                                       
                                            <DeleteUserBtn user={user} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="sellers">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Sellers</CardTitle>
                        <CardDescription>
                            View all sellers currently accepted on the platform.
                            Total Users: {[...sellers].length}

                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>

                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Email
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Role
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created at
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[ ...sellers].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
                                    <TableRow key={user?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {user?.UserId?.UserName}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.UserId?.Email}
                                        </TableCell>
                                        <TableCell>
                                            {user?.UserId?.Role}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                        {new Date(user?.UserId?.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                        
                                            <DeleteUserBtn user={user} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>

                </Card>
            </TabsContent>
            <TabsContent value="tourismGovernors">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Tourism Governors</CardTitle>
                        <CardDescription>
                            View all tourism governors currently accepted on the platform.
                            Total Users: {[...tourismGovernors].length}

                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>

                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Email
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Role
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created at
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[ ...tourismGovernors].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
                                    <TableRow key={user?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {user?.UserId?.UserName}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.UserId?.Email}
                                        </TableCell>
                                        <TableCell>
                                            {user?.UserId?.Role}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                        {new Date(user?.UserId?.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>

                                            <DeleteUserBtn user={user} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
 
                    </CardContent>

                </Card>
            </TabsContent>
        </Tabs>
    )
}