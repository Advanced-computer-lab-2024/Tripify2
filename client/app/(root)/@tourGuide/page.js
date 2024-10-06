"use client";
import { useState, useEffect } from "react";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/fetch-client";

export default function CreateItinerary() {
  const session = useSession();
  const [formData, setFormData] = useState({
    Name: "",
    Activities: [{ type: "", duration: "" }],
    StartDate: "",
    EndDate: "",
    Language: "",
    Price: "",
    DatesAndTimes: [],
    Accesibility: false,
    Pickup: "",
    Dropoff: "",
    Category: [],
    Tag: [],
    Image: "",
    TourGuide: session?.data?.user?.userId, // Assuming the TourGuide ID comes from the session
    Location: null, // New state for location
    Rating: 5,
  });

  const [datesAndTimes, setDatesAndTimes] = useState([]);
  const [categories, setCategories] = useState([]); // Categories fetched from backend
  const [tags, setTags] = useState([]); // Tags fetched from backend
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);

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

      const response = await fetcher("/itineraries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itineraryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create itinerary");
      }

      const data = await response.json();
      // router.push("/itineraries"); // Redirect to list of itineraries
    } catch (error) {
      setError(error.message);
      console.error("Error creating itinerary:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Itinerary</h1>
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
            required
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
                  required
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
                  required
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
            required
            className="block w-full border p-2"
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
            required
            className="block w-full border p-2"
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
            required
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
            required
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
            required
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
            required
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
            required
            className="block w-full border p-2"
          />
        </label>

        {/* Categories */}
        <label className="block mb-4">
          Categories:
          <select
            multiple
            name="Category"
            onChange={(e) =>
              setFormData({
                ...formData,
                Category: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
            className="block w-full border p-2"
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {/* Tags */}
        <label className="block mb-4">
          Tags:
          <select
            multiple
            name="Tag"
            onChange={(e) =>
              setFormData({
                ...formData,
                Tag: Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ),
              })
            }
            className="block w-full border p-2"
          >
            {tags.map((tag) => (
              <option key={tag._id} value={tag._id}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>

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
          Create Itinerary
        </button>
      </form>
    </div>
  );
}
