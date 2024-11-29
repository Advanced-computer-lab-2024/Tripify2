"use client";
import { fetcher } from "@/lib/fetch-client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

async function getPlaces() {
  const res = await fetcher("/places", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch places");
  }
  return res.json();
}

async function getTags() {
  const res = await fetcher("/tags", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch tags");
  }
  return res.json();
}

async function getCategories() {
  const res = await fetcher("/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((e) => console.log(e));
  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }
  return res.json();
}

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placesData = await getPlaces();
        const tagsData = await getTags();
        const categoriesData = await getCategories();
        // console.log("Fetched tags:", tagsData);
        setPlaces(placesData);
        setTags(tagsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getTagNameById = (tagId) => {
    const tag = tags.find((tag) => tag._id === tagId);
    return tag ? tag.Tag : "";
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const filteredPlaces = places.filter((place) => {
    const matchesTag = selectedTags.length
      ? selectedTags.some((tagId) => place.Tags.includes(tagId))
      : true;

    const matchesSearch =
      place.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.Tags.some((tagId) =>
        getTagNameById(tagId).toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTag && matchesSearch;
  });

  const router = useRouter();
  return (
    <div className="grid h-screen grid-cols-6 gap-4">
      <div className="col-span-1 p-4">
        <h2 className="mb-6 text-black font-bold text-lg">Filter</h2>

        <div className="mb-4">
          <h3 className="text-black font-bold mb-2">Tags</h3>
          {tags.map((tag) => (
            <div key={tag._id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={tag._id}
                checked={selectedTags.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
                className="mr-2"
              />
              <label htmlFor={tag._id} className="text-black">
                {tag.Tag}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-5 p-4 overflow-auto">
        <h2 className="text-black font-bold text-2xl mb-4">Places</h2>

        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlaces.map((place) => (
            <Card
              key={place._id}
              className="relative group transition-all duration-300 ease-in-out transform hover:scale-101 hover:shadow-xl hover:bg-gray-100"
              onClick={() => router.push(`/places/${place._id}`)}
            >
              <CardHeader>
                {place.Pictures && place.Pictures.length > 0 && (
                  <img
                    src={place.Pictures[0]}
                    alt={place.Name}
                    className="object-cover w-full h-48 mb-2 rounded-lg"
                  />
                )}
                <CardTitle className="text-lg font-bold">
                  {place.Name}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription className="text-sm text-black-600">
                  <p>
                    Tags:{" "}
                    {place.Tags.map((tagId) => {
                      const foundTag = tags.find(
                        (actualTag) => actualTag._id === tagId
                      );
                      return foundTag ? foundTag.Tag : null;
                    }).join(", ")}
                  </p>
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
