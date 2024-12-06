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
import ActivityActions from './activity-actions'
import { fetcher } from "@/lib/fetch-client"
import Image from "next/image"

export default async function DashboardPage() {
    const activitiesResponse = await fetcher('/activities/get-all').catch(err => err)

    let activities = []

    if (activitiesResponse?.ok) activities = await activitiesResponse.json()

    console.log(activities)

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
                        <CardTitle>Activities</CardTitle>
                        <CardDescription>
                            View all activities currently on the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead> */}
                                    <TableHead>Image</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Name
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Price
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Advertiser
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
                                {activities?.sort((a, b) => a?.createdAt - b?.createdAt).map((activity) => activity.AdvertiserId?._id ? (
                                    <TableRow key={activity?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                src={(activity?.Image.startsWith('http') || activity?.Image.startsWith('https') || activity?.Image.startsWith('www') || activity?.Image.startsWith('i.') || activity?.Image.startsWith('m.')) ? activity?.Image : `/images/placeholder.jpg`}
                                                width={60}
                                                height={60}
                                                alt={activity?.Name}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {activity?.Name}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${activity?.Price}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {activity?.AdvertiserId?.UserId.UserName}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {activity?.createdAt}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <ActivityActions activity={activity} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {/* <CardFooter>
                        <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        activitys
                        </div>
                    </CardFooter> */}
                </Card>
            </TabsContent>
        </Tabs>
    )
}