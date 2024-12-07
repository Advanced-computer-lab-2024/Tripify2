"use client";
import { useState, useEffect } from "react";
import LocationPicker from "@/components/shared/LocationPicker";
import LocationViewer from "@/components/shared/LoactionViewer";
import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/fetch-client";
import { Button } from "@/components/ui/button";


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
    RemainingBookings: "",
    // TourGuide: session?.data?.user?.userId,
    Location: null
  });

  const [datesAndTimes, setDatesAndTimes] = useState([]);
  const [categories, setCategories] = useState([]); // Categories fetched from backend
  const [tags, setTags] = useState([]); // Tags fetched from backend
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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
      //   JSON.stringify({
      //     itineraryData,
      //     TourGuide: session?.data?.user?.userId,
      //   })
      // );
      // console.log("-------------------------------------------");

      const response = await fetcher("/itineraries", {
        method: "POST",
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
          Category: itineraryData.Category,
          Tag: itineraryData.Tag,
          Image: itineraryData.Image,
          Location: itineraryData.Location,
          RemainingBookings: itineraryData.RemainingBookings,
          TourGuide: session?.data?.user?.userId, // Ensure the TourGuide ID is correct
        }),
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
    <div className="max-w-4xl mx-auto p-6 rounded m-4">
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
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
          />
        </label>

        {/* Activities */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 ">Activities:</h3>
          {formData.Activities.map((activity, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <label className="block mb-2">
                Activity Type:
                <input
                  type="text"
                  value={activity.type}
                  onChange={(e) =>
                    handleActivityChange(index, "type", e.target.value)
                  }
                  required
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
                  className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
          <Button
            type="button"
            onClick={addActivity}
            className="text-white py-2 px-4 rounded"
          >
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
            required
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
          />
        </label>

        {/*Booking Slots*/}
        <label className="block mb-4">
          Number Of Slots:
          <input 
            type="number" 
            name="RemainingBookings" 
            value={formData.RemainingBookings}
            onChange={handleInputChange}
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
            min="1" 
            required/>
        </label>

        {/* Dates and Times */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Dates and Times:</h3>
          <input
            type="datetime-local"
            onChange={handleDateChange}
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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
            className="border border-slate-300 rounded-lg p-2 w-full mb-4"
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="text-white py-2 px-4 rounded w-full mt-2"
        >
          Create Itinerary
        </Button>
      </form>
    </div>
  );
}
