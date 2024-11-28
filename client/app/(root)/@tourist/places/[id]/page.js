import { fetcher } from "@/lib/fetch-client";
import SharePlace from "./share-place";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
  DollarSignIcon,
  PhoneIcon,
  GlobeIcon,
  UserIcon,
  MailIcon,
  LinkIcon,
} from "lucide-react";

async function getPlace(id) {
  const res = await fetcher(`/places/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch place details");
  }
  return res.json();
}

const PlaceDetailsPage = async ({ params }) => {
  const { id } = params;
  const place = await getPlace(id);

  return (
    <div className="container p-6 mx-auto">
      <div className="relative h-96">
        <img
          src={place.Pictures[0]}
          alt={place.Name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="mb-2 text-4xl font-bold text-white">{place.Name}</h1>
        </div>
      </div>

      <div className="p-6">
        <SharePlace place={place} />

        <div className="flex justify-center mb-6">
          <p className="text-lg text-center max-w-4xl">{place.Description}</p>
        </div>

        <div className="flex space-x-6 mb-6">
          <Card className="w-1/2 p-6">
            <CardHeader>
              <CardTitle>Opening Hours and Ticket Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    Opening Hours: {place.OpeningHours}
                  </h3>
                </div>

                <div>
                  <p className="text-lg font-bold text-gray-800">
                    Ticket Prices:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {place.TicketPrices &&
                    Object.entries(place.TicketPrices).length > 0 ? (
                      Object.entries(place.TicketPrices).map(
                        ([type, price]) => (
                          <Badge key={type} variant="outline">
                            {type}: ${price}
                          </Badge>
                        )
                      )
                    ) : (
                      <span className="text-gray-500">
                        No Ticket Prices Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-1/2 p-6">
            <CardHeader>
              <CardTitle>Categories and Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-lg">Categories:</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.Categories && place.Categories.length > 0 ? (
                      place.Categories.map((category) => (
                        <Badge key={category._id} variant="outline">
                          {category.Category || "Category Not Available"}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">
                        No Categories Available
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-lg">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {place.Tags && place.Tags.length > 0 ? (
                      place.Tags.map((tag) => (
                        <Badge key={tag._id} variant="secondary">
                          {tag.Tag || "Tag Not Available"}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500">No Tags Available</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsPage;
