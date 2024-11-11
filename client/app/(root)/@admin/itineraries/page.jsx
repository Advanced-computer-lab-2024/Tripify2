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
import ItineraryActions from './itinerary-actions'
import { fetcher } from "@/lib/fetch-client"
import Image from "next/image"

export default async function DashboardPage() {
    const itinerariesResponse = await fetcher('/itineraries').catch(err => err)

    let itineraries = []

    if (itinerariesResponse?.ok) itineraries = await itinerariesResponse.json()

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
                        <CardTitle>Itineraries</CardTitle>
                        <CardDescription>
                            View all itineraries currently on the platform.
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
                                        Tour Guide
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
                                {itineraries?.sort((a, b) => a?.createdAt - b?.createdAt).map((itinerary) => itinerary.TourGuide?._id ? (
                                    <TableRow key={itinerary?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image
                                                src={(itinerary?.Image.startsWith('http') || itinerary?.Image.startsWith('https') || itinerary?.Image.startsWith('www') || itinerary?.Image.startsWith('i.') || itinerary?.Image.startsWith('m.')) ? itinerary?.Image : `/images/placeholder.jpg`}
                                                width={60}
                                                height={60}
                                                alt={itinerary?.Name}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {itinerary?.Name}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${itinerary?.Price}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {itinerary?.TourGuide?.UserId.UserName}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {itinerary?.createdAt}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <ItineraryActions itinerary={itinerary} />
                                        </TableCell>
                                    </TableRow>
                                ) : null)}
                            </TableBody>
                        </Table>
                    </CardContent>
                    {/* <CardFooter>
                        <div className="text-xs text-muted-foreground">
                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                        itinerarys
                        </div>
                    </CardFooter> */}
                </Card>
            </TabsContent>
        </Tabs>
    )
}