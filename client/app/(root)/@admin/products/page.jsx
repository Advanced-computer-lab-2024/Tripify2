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
import Search from "@/components/admin/Search"
import PriceSlider from "@/components/admin/PriceSlider"
import AddProductBtn from "@/components/admin/AddProductBtn"
import SortRatingBtn from "@/components/admin/SortRatingBtn"
import ViewReviewsBtn from "@/components/admin/ViewReviewsBtn"
import ClearFiltersBtn from "@/components/admin/ClearFiltersBtn"
import ProductEditBtn from "@/components/admin/ProductEditBtn"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { getSession } from "@/lib/session"
import Image from "next/image"

export default async function DashboardPage({ searchParams }) 
{
    const session = await getSession()

    console.log(session.user.userId)

    const maxPrice = searchParams['maxPrice'] ?? undefined
    const minPrice = searchParams['minPrice'] ?? undefined
    const search = searchParams['search'] ?? undefined
    const rating = searchParams['rating'] ?? undefined

    let query = '/products?'
    if(search) query += `search=${search}&`
    if(minPrice) query += `minPrice=${minPrice}&`
    if(maxPrice) query += `maxPrice=${maxPrice}`

    if(query.endsWith("?")) query = '/products'

    const productsResponse = await fetcher(query).catch(err => err)

    let products = []

    if(productsResponse?.ok) products = await productsResponse.json()

    return (
        <Tabs defaultValue="all">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="my-products">My Products</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-4">
                    
                   
                    {(query !== '/products' || rating) && <ClearFiltersBtn />}
                    <SortRatingBtn />
                    <PriceSlider products={products} />
                    <Search />
                    <AddProductBtn />
                </div>
            </div>
            <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Products</CardTitle>
                        <CardDescription>
                            View all products currently on the platform.
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
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Owner's Name
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Description
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Price
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Rating
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Reviews
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
                                {products?.sort((a, b) => rating === 'asc' ? a?.Rating - b?.Rating : rating === 'desc' ? b?.Rating - a?.Rating : a?.createdAt - b?.createdAt).map((product) => product?._id ? (
                                    <TableRow key={product?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            <Image 
                                                src={product?.Image.startsWith('http') || product?.Image.startsWith('https') || product?.Image.startsWith('www') || product?.Image.startsWith('i.') || product?.Image.startsWith('m.') ? product?.Image : `/images/${product?.Image}`}
                                                width={100}
                                                height={100}
                                                alt={product?.Name}
                                            />
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {product?.Name}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product?.Seller?.UserName}
                                        </TableCell>
                                        
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>{product?.Description.slice(0, 10)}...</TooltipTrigger>
                                                    <TooltipContent className='max-w-[420px]'>
                                                    <p>{product?.Description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${product?.Price}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product?.Rating}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <ViewReviewsBtn product={product} />
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {product?.createdAt}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <ProductEditBtn product={product} />
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
            <TabsContent value="my-products">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>My Products</CardTitle>
                        <CardDescription>
                            View all products currently on the platform created by me.
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
                                        Owner's Name
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Description
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Price
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell">
                                        Rating
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
                                {products?.filter(product => product?.Seller?._id === session?.user?.userId).sort((a, b) => rating === 'asc' ? a?.Rating - b?.Rating : rating === 'desc' ? b?.Rating - a?.Rating : a?.createdAt - b?.createdAt).map((product) => product?._id ? (
                                    <TableRow key={product?._id}>
                                        <TableCell className="hidden sm:table-cell">
                                            {product?.Name}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product?.Seller?.UserName}
                                        </TableCell>
                                        
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>{product?.Description.slice(0, 10)}...</TooltipTrigger>
                                                    <TooltipContent className='max-w-[420px]'>
                                                    <p>{product?.Description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ${product?.Price}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {product?.Rating}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {product?.createdAt}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <ProductEditBtn product={product} />
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