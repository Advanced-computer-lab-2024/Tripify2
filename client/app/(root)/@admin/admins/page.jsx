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
  } from "@/components/ui/tabs"
import { fetcher } from "@/lib/fetch-client"
import AddAdminBtn from "@/components/admin/AddAdminBtn"

export default async function DashboardPage() 
{
    const adminsResponse = await fetcher('/admins').catch(err => err)

    let admins = []

    if(adminsResponse?.ok) admins = await adminsResponse.json()

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
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
                    */}
                    <AddAdminBtn />
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Admins</CardTitle>
                        <CardDescription>
                            View all admins currently on the platform.
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
                                {admins?.sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user.UserId?._id ? (
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