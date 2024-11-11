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
import UserActions from './user-actions'
import { fetcher } from "@/lib/fetch-client"

export default async function DashboardPage() {
    const usersResponse = await fetcher('/users/get-all/delete-requests').catch(err => err)

    let users = []

    if (usersResponse?.ok) users = await usersResponse.json()

    console.log(users)

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <div className="flex items-center gap-2 ml-auto">
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
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                            View all users currently requesting deletion on the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead> */}
                                    <TableHead className="hidden md:table-cell">
                                        Name
                                    </TableHead>
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
                                {users?.sort((a, b) => a?.createdAt - b?.createdAt).map((user) => user._id ? (
                                    <TableRow key={user?._id}>
                                        <TableCell className="font-medium">
                                            {user?.UserName}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.Email}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {user?.Role}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {user?.createdAt}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <UserActions user={user} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {/* <CardFooter>
                        <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        users
                        </div>
                    </CardFooter> */}
                </Card>
            </TabsContent>
        </Tabs>
    )
}