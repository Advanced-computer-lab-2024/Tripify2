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
import AddCategoryBtn from "@/components/admin/AddCategoryBtn"
import CategoryActionBtns from "@/components/admin/CategoryActionBtns"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default async function DashboardPage() 
{
    const categoriesResponse = await fetcher('/categories').catch(err => err)

    let categories = []

    if(categoriesResponse?.ok) categories = await categoriesResponse.json()

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
                    <AddCategoryBtn />
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                            View all categories currently on the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* <TableHead className="hidden w-[100px] sm:table-cell">
                                        <span className="sr-only">Image</span>
                                    </TableHead> */}
                                    <TableHead>Category</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Created at
                                    </TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories?.sort((a, b) => a?.createdAt - b?.createdAt).map((category) => category?._id ? (
                                    <TableRow key={category?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {category?.Category}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(category?.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <CategoryActionBtns category={category} />
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