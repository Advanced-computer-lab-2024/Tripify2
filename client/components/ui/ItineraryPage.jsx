"use client";
import React from "react";
//import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { fetcher } from "@/lib/fetch-client";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

function ItineraryPage({ itinerary, params }) {
  const router = useRouter();
  const { id } = useParams();
  let count = 0;
  const [readcategories, setReadcategories] = useState([]);
  const [readtags, setReadtags] = useState([]);
  const [mode, setMode] = useState("Read");

  /*create code*/
  const session = useSession();
  // console.log(session?.data?.user?.userId);
  const [formData, setFormData] = useState({
    Name: itinerary.Name,
    Activities: itinerary.Activities,
    StartDate: itinerary.StartDate,
    EndDate: itinerary.EndDate,
    Language: itinerary.Language,
    Price: itinerary.Price,
    DatesAndTimes: itinerary.DatesAndTimes,
    Accesibility: itinerary.Accesibility,
    Pickup: itinerary.Pickup,
    Dropoff: itinerary.Dropoff,
    Category: itinerary.Category.map(tag => tag.Category),
    Tag: itinerary.Tag.map(tag => tag.Tag),
    Image: itinerary.Image,
    // TourGuide: session?.data?.user?.userId,
    Location: itinerary.Location,
    Rating: 5,
  });

  const [datesAndTimes, setDatesAndTimes] = useState([]);
  const [categories, setCategories] = useState([]); // Categories fetched from backend
  const [tags, setTags] = useState([]); // Tags fetched from backend
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        // Otherwise, add it
        return [...prevSelected, categoryId];
      }
    });

    // Update form data with the new selected categories
    setFormData((prevFormData) => ({
      ...prevFormData,
      Category: selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId) // Remove category if it's already selected
        : [...selectedCategories, categoryId], // Add category if it's not selected
    }));
  };

  console.log("categoriessssss:   "+categories)

  

  const handleTagChange = (tagId) => {
    setSelectedTags((prevSelected) => {
      if (prevSelected.includes(tagId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== tagId);
      } else {
        // Otherwise, add it
        return [...prevSelected, tagId];
      }
    });

    // Update form data with the new selected categories
    setFormData((prevFormData) => ({
      ...prevFormData,
      Tag: selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId) // Remove category if it's already selected
        : [...selectedTags, tagId], // Add category if it's not selected
    }));
  };

  // Fetch categories and tags from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([
          fetcher("/categories"),
          fetcher("/tags"),
        ]);

        const categoriesData = await categoriesResponse.json();
        const tagsData = await tagsResponse.json();
        
        setCategories(categoriesData);
        setTags(tagsData);
      } catch (err) {
        console.error("Error fetching categories or tags:", err);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox for Accesibility
    if (type === "checkbox") {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  // Handle change for the radio buttons
  const handleRatingChange = (event) => {
    setRating(Number(event.target.value)); // Update state with the selected rating
  };

  // Handle date and time additions
  const handleDateChange = (e) => {
    const { value } = e.target;
    setDatesAndTimes((prevDates) => [...prevDates, value]);
  };

  // Remove a date and time
  const removeDateTime = (index) => {
    setDatesAndTimes((prevDates) => prevDates.filter((_, i) => i !== index));
  };

  // Handle activity changes
  const handleActivityChange = (index, field, value) => {
    const updatedActivities = formData.Activities.map((activity, i) =>
      i === index ? { ...activity, [field]: value } : activity
    );
    setFormData({ ...formData, Activities: updatedActivities });
  };

  // Add a new activity
  const addActivity = () => {
    setFormData((prevData) => ({
      ...prevData,
      Activities: [...prevData.Activities, { type: "", duration: "" }],
    }));
  };

  // Remove an activity
  const removeActivity = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      Activities: prevData.Activities.filter((_, i) => i !== index),
    }));
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    setFormData((prevData) => ({
      ...prevData,
      Location: location,
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data to send
      const itineraryData = {
        ...formData,
        DatesAndTimes: datesAndTimes,
        // TourGuide: session?.data?.user?.userId,
      };

      // console.log("-------------------------------------------");
      // console.log(
      // JSON.stringify({
      // itineraryData,
      // TourGuide: session?.data?.user?.userId,
      // })
      // );
      // console.log("-------------------------------------------");

      const response = await fetcher(`/itineraries/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: itineraryData.Name,
          Activities: itineraryData.Activities,
          StartDate: itineraryData.StartDate,
          EndDate: itineraryData.EndDate,
          Language: itineraryData.Language,
          Price: itineraryData.Price,
          DatesAndTimes: itineraryData.DatesAndTimes,
          Accesibility: itineraryData.Accesibility,
          Pickup: itineraryData.Pickup,
          Dropoff: itineraryData.Dropoff,
          TourGuide: session?.data?.user?.userId,
          //Category: itineraryData.Category,
          //Tag: itineraryData.Tag,
          Image: itineraryData.Image,
          Location: itineraryData.Location,
          Rating: itineraryData.Rating,
          //TourGuide: session?.data?.user?.userId // Ensure the TourGuide ID is correct
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update itinerary");
      }

      const data = await response.json();
      // router.push("/itineraries"); // Redirect to list of itineraries
    } catch (error) {
      setError(error.message);
      console.error("Error updating itinerary:", error);
    }
  };
  /*const router = useRouter();
 const activitiesClick = (id) => {
 router.push(`/MyActivities/${id}`);
 };*/

  async function deleteitinerary() {
    const deleteitineraries = await fetcher(`/itineraries/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e) => console.log(e));
    if (!deleteitineraries?.ok) {
      console.log("err");
    }
    return router.push("/myitineraries");
  }

  const dateandtimelist = itinerary.DatesAndTimes.map((date) => (
    <li className="border rounded-md drop-shadow-md border-black w-fit min-w-48 p-2">
      {date}
    </li>
  ));
  const activitylist = itinerary.Activities.map((activity) => {
    count++;
    return (
      <li className="border rounded-md drop-shadow-md border-black w-fit min-w-48 p-2">
        <button
          className="w-full h-full" /*onClick={() => activitiesClick(activity._id)}*/
        >
          <h2>Activity-{count}</h2>
          <div>
            <h2>Type: {activity.type}</h2>
            <h2>Duration: {activity.duration}</h2>
          </div>
        </button>
      </li>
    );
  });

  const fetchTags = async (id) => {
    try {
      const response = await fetcher(`/tags/${id}`);
      const data = await response.json();
      setReadtags((old) => {
        let array = [];
        array = array.concat(old);
        array.push(data);
        return array;
      });
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };
  const fetchCategories = async (id) => {
    try {
      const response = await fetcher(`/categories/${id}`);
      const data = await response.json();
      setReadcategories((old) => {
        let array = [];
        array = array.concat(old);
        array.push(data);
        return array;
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };
  useEffect(() => {
    itinerary.Tag.map((id) => fetchTags(id._id));
    itinerary.Category.map((id) => fetchCategories(id._id));
  }, []);

  const categorylist = readcategories.map((category) => (
    <li>{category.Category}</li>
  ));
  const taglist = readtags.map((tag) => <li>{tag.Tag}</li>);
  console.log(readtags+"hmmmm")

  return (
    <>
      {mode == "Read" ? (
        <div className="p-4 flex flex-col gap-2">
          <h1 className="text-xl">
            <strong>Itinerary Details</strong>
          </h1>
          <div>
            <h2 className="mb-2 text-lg">
              <strong>Activities</strong>
            </h2>
            <ul className="flex flex-col gap-2">{activitylist}</ul>
          </div>
          <hr />
          <div>
            <h2>
              <strong>Locations</strong>
            </h2>
            <li className="border rounded-md drop-shadow-md border-black w-fit min-w-48 p-2">
              {itinerary.Location.type} & {itinerary.Location.coordinates}
            </li>
          </div>
          <hr />
          <h2>
            <strong>Start Date:</strong> {itinerary.StartDate}
          </h2>
          <hr />
          <h2>
            <strong>End Date:</strong> {itinerary.EndDate}
          </h2>
          <hr />
          <h2>
            <strong>Language:</strong> {itinerary.Language}
          </h2>
          <hr />
          <h2>
            <strong>Price:</strong> {itinerary.Price}
          </h2>
          <hr />
          <div>
            <h2>
              <strong>Dates And Times</strong>
            </h2>
            <ul>{dateandtimelist}</ul>
          </div>
          <hr />
          <h2>
            <strong>Accessibility:</strong>{" "}
            {itinerary.Accesibility ? "true" : "false"}
          </h2>
          <hr />
          <h2>
            <strong>Pickup:</strong> {itinerary.Pickup}
          </h2>
          <hr />
          <h2>
            <strong>Dropoff:</strong> {itinerary.Dropoff}
          </h2>
          <hr />
          <div>
            <h2>
              <strong>Categories</strong>
            </h2>
            <ul>{categorylist}</ul>
          </div>
          <hr />
          <div>
            <h2>
              <strong>Tags</strong>
            </h2>
            <ul>{taglist.length !== 0 ? taglist : <li>No Tags</li>}</ul>
          </div>
          <hr />
          <h2>
            <strong>Inappropriate:</strong>{" "}
            {itinerary.Inappropriate ? "true" : "false"}
          </h2>
          <hr />
          <div>
            <h2>
              <strong>Image:</strong>
            </h2>
            <img src={itinerary.Image} alt="" />
          </div>
          <hr />
          <h2>
            <strong>Rating:</strong> {itinerary.Rating}
          </h2>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setMode("Edit")}
          >
            Edit
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => deleteitinerary()}
          >
            Delete
          </button>
        </div>
      ) : (
        <div className="max-w-xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Edit Itinerary</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <label className="block mb-4">
              Name:
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                className="block w-full border p-2"
              />
            </label>

            {/* Activities */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Activities:</h3>
              {formData.Activities.map((activity, index) => (
                <div key={index} className="border p-4 mb-4">
                  <label className="block mb-2">
                    Activity Type:
                    <input
                      type="text"
                      value={activity.type}
                      onChange={(e) =>
                        handleActivityChange(index, "type", e.target.value)
                      }
                      className="block w-full border p-2"
                      
                    />
                  </label>
                  <label className="block mb-2">
                    Duration (hours):
                    <input
                      type="number"
                      value={activity.duration}
                      onChange={(e) =>
                        handleActivityChange(index, "duration", e.target.value)
                      }
                      className="block w-full border p-2"
                      
                    />
                  </label>
                  {formData.Activities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeActivity(index)}
                      className="text-red-500 mt-2"
                    >
                      Remove Activity
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addActivity}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Add Activity
              </button>
            </div>

            {/* Location Picker */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Location:</h3>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>

            {/* Display selected location */}
            {formData.Location && (
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">
                  Selected Location:
                </h4>
                <LocationViewer location={formData.Location} />
              </div>
            )}

            {/* Start Date */}
            <label className="block mb-4">
              Start Date:
              <input
                type="date"
                name="StartDate"
                value={formData.StartDate}
                onChange={handleInputChange}
                className="block w-full border p-2"
                required
              />
            </label>

            {/* End Date */}
            <label className="block mb-4">
              End Date:
              <input
                type="date"
                name="EndDate"
                value={formData.EndDate}
                onChange={handleInputChange}
                className="block w-full border p-2"
                required
              />
            </label>

            {/* Language */}
            <label className="block mb-4">
              Language:
              <input
                type="text"
                name="Language"
                value={formData.Language}
                onChange={handleInputChange}
                className="block w-full border p-2"
                
              />
            </label>

            {/* Price */}
            <label className="block mb-4">
              Price:
              <input
                type="number"
                name="Price"
                value={formData.Price}
                onChange={handleInputChange}
                className="block w-full border p-2"
                
              />
            </label>

            {/* Dates and Times */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Dates and Times:</h3>
              <input
                type="datetime-local"
                onChange={handleDateChange}
                className="block w-full border p-2 mb-2"
                required
              />
              {datesAndTimes.map((dateTime, index) => (
                <div key={index} className="flex items-center mb-2">
                  <span className="flex-1">
                    {new Date(dateTime).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeDateTime(index)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Accessibility */}
            <label className="block mb-4">
              Accessibility:
              <input
                type="checkbox"
                name="Accesibility"
                checked={formData.Accesibility}
                onChange={handleInputChange}
                className="ml-2"
                
              />
            </label>

            {/* Pickup */}
            <label className="block mb-4">
              Pickup Location:
              <input
                type="text"
                name="Pickup"
                value={formData.Pickup}
                onChange={handleInputChange}
                className="block w-full border p-2"
                
              />
            </label>

            {/* Dropoff */}
            <label className="block mb-4">
              Dropoff Location:
              <input
                type="text"
                name="Dropoff"
                value={formData.Dropoff}
                onChange={handleInputChange}
                className="block w-full border p-2"
                
              />
            </label>

            {/* Image */}
            <label className="block mb-4">
              Image URL:
              <input
                type="text"
                name="Image"
                value={formData.Image}
                onChange={handleInputChange}
                className="block w-full border p-2"
                
              />
            </label>

        {/* Categories */}
        <div className="block mb-4">
          <span className="block mb-2">Categories:</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label
                key={category._id}
                className={`cursor-pointer p-2 border rounded ${
                  selectedCategories.includes(category._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  value={category._id}
                  onChange={() => handleCategoryChange(category._id)}
                  checked={selectedCategories.includes(category._id)}
                  //className="hidden" // Hide the default checkbox
                />
                {category.Category}
              </label>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="block mb-4">
          <span className="block mb-2">Tags:</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label
                key={tag._id}
                className={`cursor-pointer p-2 border rounded ${
                  selectedTags.includes(tag._id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  value={tag._id}
                  onChange={() => handleTagChange(tag._id)}
                  checked={selectedTags.includes(tag._id)}
                  className="hidden" // Hide the default checkbox
                />
                {tag.Tag}
              </label>
            ))}
          </div>
        </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Rate Us (0 to 5)</h2>
              <div className="mb-4">
                {/* Create radio buttons for each rating option */}
                {[0, 1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="block mb-2">
                    <input
                      type="radio"
                      value={value}
                      checked={rating === value} // Check if the value is the selected rating
                      onChange={handleRatingChange} // Update state on change
                      className="mr-2" // Add margin for spacing
                      required
                    />
                    {value}
                  </label>
                ))}
              </div>
              <p className="text-sm">Your rating: {rating}</p>{" "}
              {/* Display the selected rating */}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded w-full"
            >
              Edit Itinerary
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default ItineraryPage;
