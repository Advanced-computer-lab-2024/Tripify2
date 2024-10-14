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
import ApplicationActionBtns from "@/components/admin/ApplicationActionBtns"
import ViewDocuments from "./view-documents"

export default async function DashboardPage() 
{
    const advertisersResponse = await fetcher('/advertisers?application=true').catch(err => err)
    const tourguidesResponse = await fetcher('/tourguides?application=true').catch(err => err)
    const sellersResponse = await fetcher('/sellers?application=true').catch(err => err)

    let advertisers = [], tourguides = [], sellers = []

    if(advertisersResponse?.ok) advertisers = await advertisersResponse.json()
    if(tourguidesResponse?.ok) tourguides = await tourguidesResponse.json()
    if(sellersResponse?.ok) sellers = await sellersResponse.json()

    return (
        <Tabs defaultValue="advertisers">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="advertisers">Advertisers</TabsTrigger>
                    <TabsTrigger value="tourguides">Tourguides</TabsTrigger>
                    <TabsTrigger value="sellers">Sellers</TabsTrigger>
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
            <TabsContent value="advertisers">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Advertisers</CardTitle>
                        <CardDescription>
                            View all advertisers currently pending acceptance on the platform.
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
                                    <TableHead className="hidden md:table-cell">
                                        Documents
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
                                        <TableCell className="hidden underline md:table-cell">
                                            <ViewDocuments documents={user.Document} />
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
                                        
                                            <ApplicationActionBtns user={user} />
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
            <TabsContent value="tourguides">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Tourguides</CardTitle>
                        <CardDescription>
                            View all tourguides currently pending acceptance on the platform.
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
                                    <TableHead className="hidden md:table-cell">
                                        Documents
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
                                        <TableCell className="hidden underline md:table-cell">
                                            <ViewDocuments documents={user.Documents} />
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
                                        
                                            <ApplicationActionBtns user={user} />
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
            <TabsContent value="sellers">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Sellers</CardTitle>
                        <CardDescription>
                            View all sellers currently pending acceptance on the platform.
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
                                    <TableHead className="hidden md:table-cell">
                                        Documents
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
                                        <TableCell className="hidden underline md:table-cell">
                                            <ViewDocuments documents={user.Documents} />
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
                                        
                                            <ApplicationActionBtns user={user} />
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
        </Tabs>
    )
}