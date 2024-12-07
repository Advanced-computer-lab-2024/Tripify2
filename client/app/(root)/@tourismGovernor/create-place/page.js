"use client"; // Marking this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/lib/fetch-client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import LogoutBtn from "@/components/ui/LogoutBtn";

export default function MyPlaces() {
  const router = useRouter();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState(null);
  const [tagsButton, setTagsButton] = useState([]); // To store fetched tags
  const [categoriesButton, setCategoriesButton] = useState([]); // To store fetched categories
  const [newPlace, setNewPlace] = useState({
    Name: "",
    Description: "",
    Categories: [],
    Tags: [],
    Type: "",
    TicketPrices: {},
    OpeningHours: "",
    location: null,
    Pictures: [],
  });
  const [tags, setTags] = useState([]);
  const session = useSession();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const [wrongType, setWrongType] = useState();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const disableButton =
    !newPlace?.Name.trim() ||
    !newPlace?.Description.trim() ||
    !newPlace?.Categories.length ||
    !newPlace?.Tags.length ||
    !newPlace?.Type.trim() ||
    !Object.keys(newPlace?.TicketPrices || {}).length ||
    !newPlace?.location;

  useEffect(() => {
    if (buttonClicked && !wrongType) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setButtonClicked(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [buttonClicked, wrongType]);

  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      try {
        // Fetch Tags
        const tagResponse = await fetch("http://localhost:3001/tags");
        const tagData = await tagResponse.json();
        setTagsButton(tagData);

        // Fetch Categories
        const categoryResponse = await fetch(
          "http://localhost:3001/categories"
        );
        const categoryData = await categoryResponse.json();
        setCategoriesButton(categoryData);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTagsAndCategories();
  }, []);

  const handleAddPair = () => {
    if (key.trim() !== "") {
      setNewPlace((prevPlace) => ({
        ...prevPlace,
        TicketPrices: {
          ...prevPlace.TicketPrices,
          [key]: value,
        },
      }));
      setKey("");
      setValue("");
    }
  };

  const handleEditValue = (key, newValue) => {
    setNewPlace((prevPlace) => ({
      ...prevPlace,
      TicketPrices: {
        ...prevPlace.TicketPrices,
        [key]: newValue,
      },
    }));
  };

  const handleDeletePair = (keyToDelete) => {
    setNewPlace((prevPlace) => {
      const { [keyToDelete]: _, ...rest } = prevPlace.TicketPrices;
      return {
        ...prevPlace,
        TicketPrices: rest,
      };
    });
  };

  const handleLocationSelect = (location) => {
    setNewPlace((prevPlace) => ({
      ...prevPlace,
      location,
    }));
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetcher(`/tourism-governors/get-all/my-places`);

        //console.log(response)

        const data = await response.json();
        //console.log(data)
        setPlaces(data.AddedPlaces);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const createPlace = async () => {
    setButtonClicked(true);

    let typeValid =
      newPlace?.Type.trim().toLowerCase() === "museum" ||
      newPlace?.Type.trim().toLowerCase() === "historical place";

    setWrongType(typeValid);

    if (typeValid) {
      try {
        const response = await fetcher("/places", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newPlace,
            TourismGovernor: session?.data?.user?.id,
            Location: newPlace.location,
          }),
        });

        const data = await response.json();

        //setPlaces([...places, data]); // Update the places list with the new place
        setNewPlace({ Name: "", Description: "", Categories: [], Tags: [] }); // Reset the newPlace state
        router.push("/");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const createTag = async () => {
    try {
      const response = await fetcher("/tags", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Tag: newTag,
          UserId: session?.data?.user?.userId,
        }),
      });

      const data = await response.json();
      setTags([...tags, data]); // Update the tags list with the new tag
      setNewTag(""); // Reset the newTag state
    } catch (err) {
      setError(err.message);
    }
  };

  const [loadingDelete, setLoadingDelete] = useState(false);

  const deletePlace = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      setLoadingDelete(true);
      try {
        await fetcher(`/places/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setPlaces(places.filter((place) => place._id !== id)); // Remove deleted place from the list
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  //console.log(newPlace.location)

  const startEdit = (place) => {
    // Redirect to the update page and pass the place data as query params
    router.push(`/${place._id}`);
  };

  if (loading) {
    return <div>Loading your places...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // if (!places.length) {
  //   return <div>No places found!</div>;
  // }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white">
      <h1 className="text-2xl font-bold text-gray-800">
        My Created Museums and Historical Places
      </h1>

      <div>
        <h2 className="text-xl font-bold text-gray-700">Create a New Place</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            type="text"
            placeholder="Name"
            value={newPlace.Name}
            onChange={(e) => setNewPlace({ ...newPlace, Name: e.target.value })}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Description"
            value={newPlace.Description}
            onChange={(e) =>
              setNewPlace({ ...newPlace, Description: e.target.value })
            }
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Type"
            value={newPlace.Type}
            onChange={(e) => setNewPlace({ ...newPlace, Type: e.target.value })}
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Opening Hours"
            value={newPlace.OpeningHours}
            onChange={(e) =>
              setNewPlace({ ...newPlace, OpeningHours: e.target.value })
            }
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Pictures (comma-separated URLs)"
            value={newPlace.Pictures}
            onChange={(e) =>
              setNewPlace({ ...newPlace, Pictures: e.target.value.split(",") })
            }
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 col-span-full"
          />
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-md space-y-4">
        <h2 className="text-xl font-bold">Ticket Prices</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter ticket type"
            className="flex-1 p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter price"
            className="flex-1 p-3 border rounded-md focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleAddPair}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="space-y-2">
          {Object.entries(newPlace.TicketPrices || {}).map(([k, v]) => (
            <div key={k} className="flex items-center gap-4">
              <span className="w-1/3 font-medium">{k}:</span>
              <input
                type="number"
                value={v}
                onChange={(e) => handleEditValue(k, e.target.value)}
                className="flex-1 p-3 border rounded-md focus:ring focus:ring-blue-300"
              />
              <button
                onClick={() => handleDeletePair(k)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold">Location</h3>
        <LocationPicker onLocationSelect={handleLocationSelect} />
      </div>

      <div>
        <h3 className="text-lg font-bold">Select Category</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          {categoriesButton.map((category) => (
            <label key={category._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="category"
                value={category._id}
                checked={newPlace.Categories.includes(category._id)}
                onChange={(e) => {
                  const categories = [...newPlace?.Categories];
                  e.target.checked
                    ? setNewPlace({
                        ...newPlace,
                        Categories: [...categories, category?._id],
                      })
                    : setNewPlace({
                        ...newPlace,
                        Categories: categories.filter(
                          (singleCategory) => singleCategory !== category?._id
                        ),
                      });
                }}
                className="focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">{category.Category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold">Select Tag</h3>
        <div className="flex flex-wrap gap-4 mt-2">
          {tagsButton.map((tag) => (
            <label key={tag._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="tag"
                value={tag._id}
                checked={newPlace.Tags.includes(tag._id)}
                onChange={(e) => {
                  const tags = [...newPlace?.Tags];
                  e.target.checked
                    ? setNewPlace({
                        ...newPlace,
                        Tags: [...tags, tag?._id],
                      })
                    : setNewPlace({
                        ...newPlace,
                        Tags: tags.filter(
                          (singleTag) => singleTag !== tag?._id
                        ),
                      });
                }}
                className="focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">{tag.Tag}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={createPlace}
        disabled={disableButton}
        className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
      >
        Create Place
      </Button>

      {buttonClicked && !wrongType && showMessage && (
        <p className="text-red-500 mt-2 text-center">
          Please pick a type from "Historical Place" or "Museum"
        </p>
      )}
    </div>
  );

  {
    /* ///////////////////////////// */
  }

  {
    /* Tag Creation Section */
  }
  {
    /* <h2 className="text-xl font-bold">Create a New Tag</h2>
      <input
        type="text"
        placeholder="New Tag (e.g., Monuments, Museums)"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
      />
      <Button onClick={createTag}>Create Tag</Button>

      <ul style={styles.placeList}>
        {places?.map((place) => (
          <li key={place._id} style={styles.placeItem}>
            {place.Name}
            {place.Image && (
              <img src={place.Image} alt={place.Name} style={styles.image} />
            )}
            <p>Description: {place.Description}</p>
            <p>Type: {place.Type}</p>
            {place.Location && (
              <div className="mt-4">
                <h4 className="mb-2 text-lg font-semibold">
                  Selected Location:
                </h4>
                <LocationViewer location={place.Location} />
              </div>
            )}
            <p>Opening Hours: {place.OpeningHours}</p>
            <p>Pictures: {place?.Pictures?.join(", ")}</p>
            <p>Ticket Prices: {JSON.stringify(place.TicketPrices)}</p>
            <p>Category: {place?.Categories?.join(", ")}</p>
            <p>Tags: {place?.Tags?.join(", ")}</p>
            <Button onClick={() => startEdit(place)}>View Place</Button>
            <Button onClick={() => deletePlace(place._id)}>Delete Place</Button>
          </li>
        ))}
      </ul> */
  }
  {
    /* ///////////////////////////////////////// */
  }
  {
    /* </div> */
  }
  {
    /* ); */
  }
}

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "0 auto",
  },
  placeList: {
    listStyleType: "none",
    padding: 0,
  },
  placeItem: {
    marginBottom: "20px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};
