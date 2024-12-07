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
import { Button } from "@/components/ui/button";

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
    RemainingBookings: itinerary.RemainingBookings,
    DatesAndTimes: itinerary.DatesAndTimes,
    Accesibility: itinerary.Accesibility,
    Pickup: itinerary.Pickup,
    Dropoff: itinerary.Dropoff,
    Category: itinerary.Category.map((tag) => tag.Category),
    Tag: itinerary.Tag.map((tag) => tag.Tag),
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
  //console.log(`itinerary.Tag: ${JSON.stringify(itinerary.Tag)}`);
  const tagIds= itinerary?.Tag.map(tag => tag?._id);
  const categoryIds= itinerary?.Category.map(category => category?._id);
  const [selectedTags, setSelectedTags] = useState(tagIds);
  const [selectedCategories, setSelectedCategories] = useState(categoryIds);

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

  //console.log("categoriessssss:   "+categories)

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
          RemainingBookings: itineraryData.RemainingBookings,
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
    <li className="border shadow border-slate-300 rounded-lg min-w-60 h-20 flex justify-center items-center p-2">
      {date}
    </li>
  ));
  const activitylist = itinerary.Activities.map((activity) => {
    count++;
    return (
      <li>
        <button
          className="border shadow border-slate-300 rounded-lg w-56 h-64 flex flex-col justify-start items-center" /*onClick={() => activitiesClick(activity._id)}*/
        >
          <img
            className="w-56 h-40 rounded-lg"
            src="/images/placeholder.jpg"
            alt=""
          />
          <h2 className="text-lg text-semibold mt-1">Activity-{count}</h2>
          <div>
            <h2 className="text-slate-500">Type: {activity.type}</h2>
            <h2 className="text-slate-500">
              {activity.duration > 1
                ? `Duration: ${activity.duration} Hours`
                : `Duration: ${activity.duration} Hour`}
            </h2>
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
    <li className="border shadow border-slate-300 rounded-lg min-w-48 w-auto h-20 p-2 flex justify-center items-center">
      {category.Category}
    </li>
  ));
  const taglist = readtags.map((tag) => (
    <li className="border shadow border-slate-300 rounded-lg min-w-48 w-auto h-20 flex justify-center items-center">
      {tag.Tag}
    </li>
  ));
  //console.log(readtags + "hmmmm");

  const [locationBool, setLocationBol] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 rounded m-4">
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
            className="block w-full border p-2 rounded border-slate-400"
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
                  className="block w-full border p-2  rounded border-slate-400"
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
                  className="block w-full border p-2  rounded border-slate-400"
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
          <Button type="button" onClick={addActivity}>
            Add Activity
          </Button>
        </div>

        {/* Location Picker */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Location:</h3>
          <LocationPicker onLocationSelect={handleLocationSelect} />
        </div>

        {/* Display selected location */}
        {formData.Location && (
          <div className="mb-4">
            <h4 className="text-lg font-semibold mb-2">Selected Location:</h4>
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
            className="block w-full border p-2  rounded border-slate-400"
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
            className="block w-full border p-2  rounded border-slate-400"
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
            className="block w-full border p-2  rounded border-slate-400"
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
            className="block w-full border p-2  rounded border-slate-400"
          />
        </label>

        {/*Booking Slots*/}
        <label className="block mb-4">
          Remaining Bookings:
          <input
            type="number"
            name="RemainingBookings"
            value={formData.RemainingBookings}
            onChange={handleInputChange}
            className="block w-full border p-2  rounded border-slate-400"
            min="1"
            required
          />
        </label>

        {/* Dates and Times */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Dates and Times:</h3>
          <input
            type="datetime-local"
            onChange={handleDateChange}
            className="block w-full border p-2 mb-2 rounded border-slate-400"
            required
          />
          {datesAndTimes.map((dateTime, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="flex-1">
                {new Date(dateTime).toLocaleString()}
              </span>
              <Button
                type="button"
                onClick={() => removeDateTime(index)}
                className="text-red-500"
              >
                Remove
              </Button>
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
            className="block w-full border p-2  rounded border-slate-400"
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
            className="block w-full border p-2  rounded border-slate-400"
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
            className="block w-full border p-2  rounded border-slate-400"
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
                  className="hidden" // Hide the default checkbox
                />{" "}
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="text-white py-2 px-4 rounded w-full mt-2"
        >
          Edit Itinerary
        </Button>
      </form>
    </div>
  );
}

export default ItineraryPage;
