import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { fetcher } from "@/lib/fetch-client"
import DeleteUserBtn from "@/components/admin/DeleteUserBtn"

export default async function DashboardPage() 
{
    const advertisersResponse = await fetcher('/advertisers?accepted=true').catch(err => err)
    const touristsResponse = await fetcher('/tourists').catch(err => err)
    const tourguidesResponse = await fetcher('/tourguides?accepted=true').catch(err => err)
    const sellersResponse = await fetcher('/sellers?accepted=true').catch(err => err)
    const tourismGovernorsResponse = await fetcher('/tourism-governors').catch(err => err)

    let advertisers = [], tourists = [], tourguides = [], sellers = [], tourismGovernors = []

    if(advertisersResponse?.ok) advertisers = await advertisersResponse.json()
    if(touristsResponse?.ok) tourists = await touristsResponse.json()
    if(tourguidesResponse?.ok) tourguides = await tourguidesResponse.json()
    if(sellersResponse?.ok) sellers = await sellersResponse.json()
    if(tourismGovernorsResponse?.ok) tourismGovernors = await tourismGovernorsResponse.json()

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
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1">
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Filter
                            </span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                            Active
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>
                            Archived
                        </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                        </span>
                    </Button> */}
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            View all users currently accepted on the platform.
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
                                {[...advertisers, ...tourists, ...tourguides, ...sellers, ...tourismGovernors].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
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
                                            {user?.UserId?.createdAt}
                                        </TableCell>
                                        <TableCell>
                                        {/* <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                                >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu> */}
                                        
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
            <TabsContent value="advertisers">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Advertisers</CardTitle>
                        <CardDescription>
                            View all advertisers currently accepted on the platform.
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
                                            {user?.UserId?.createdAt}
                                        </TableCell>
                                        <TableCell>
                                        {/* <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                                >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu> */}
                                        
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
                                {[...tourists].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
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
                                            {user?.UserId?.createdAt}
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
                                {[...tourguides].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
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
                                            {user?.UserId?.createdAt}
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
                                {[...sellers].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
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
                                            {user?.UserId?.createdAt}
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
                                {[...tourismGovernors].sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
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
                                            {user?.UserId?.createdAt}
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