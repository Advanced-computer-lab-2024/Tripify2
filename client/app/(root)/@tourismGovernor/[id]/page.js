"use client";
import { fetcher } from "@/lib/fetch-client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ViewPlace() {
  const params = useParams();
  const router = useRouter();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tagsButton, setTagsButton] = useState([]); // To store fetched tags
  const [categoriesButton, setCategoriesButton] = useState([]); // To store fetched categories
  const [updatedPlace, setUpdatedPlace] = useState({
    Name: '',
    Description: '',
    Type: '',
    Location: '',
    OpeningHours: '',
    Pictures: '',
    TicketPrices: '',
    Tags: '',
    Categories: ''
  });

  // Fetch place data when the component mounts
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`http://localhost:3001/places/${params.id}`);
        const data = await response.json();
        setPlace(data);
        setUpdatedPlace({
          Name: data.Name,
          Description: data.Description,
          Type: data.Type,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          Pictures: data.Pictures.join(', '),
          TicketPrices: JSON.stringify(data.TicketPrices),
          Tags: data.Tags.join(', '),
          Categories: data.Categories.join(', ')
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlace();
  }, [params.id]);

  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      try {
        // Fetch Tags
        const tagResponse = await fetch('http://localhost:3001/tags');
        const tagData = await tagResponse.json();
        setTagsButton(tagData);

        // Fetch Categories
        const categoryResponse = await fetch('http://localhost:3001/categories');
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

  // Update place data
  const handleUpdate = async () => {
    // check route
    try {
      const response = await fetcher(`/places/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedPlace,
          Pictures: updatedPlace.Pictures.split(','),
          TicketPrices: JSON.parse(updatedPlace.TicketPrices),
          Tags: updatedPlace.Tags.split(','),
          Categories: updatedPlace.Categories.split(',')
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPlace(data);
        alert("Place updated successfully!");
        router.push("/"); // Redirect after update
      } else {
        setError("Failed to update place.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading place details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Update Place</h1>
      <input
        type="text"
        placeholder="Name"
        value={updatedPlace.Name}
        onChange={(e) => setUpdatedPlace({ ...updatedPlace, Name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={updatedPlace.Description}
        onChange={(e) => setUpdatedPlace({ ...updatedPlace, Description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Type"
        value={updatedPlace.Type}
        onChange={(e) => setUpdatedPlace({ ...updatedPlace, Type: e.target.value })}
      />
      <input
        type="text"
        placeholder="Location"
        value={updatedPlace.Location}
        onChange={(e) => setUpdatedPlace({ ...updatedPlace, Location: e.target.value })}
      />
      <input
        type="text"
        placeholder="Opening Hours"
        value={updatedPlace.OpeningHours}
        onChange={(e) => setUpdatedPlace({ ...updatedPlace, OpeningHours: e.target.value })}
      />
      <input
        type="text"
        placeholder="Pictures (comma-separated URLs)"
        value={updatedPlace.Pictures}
        onChange={(e) => setUpdatedPlace({ ...updatedPlace, Pictures: e.target.value })}
      />
      <input
        type="text"
        placeholder="Ticket Prices (JSON format)"
        value={updatedPlace.TicketPrices}
        onChange={(e) => setUpdatedPlace({ ...updatedPlace, TicketPrices: e.target.value })}
      />
       {/* Render Category Radio Buttons */}
    <h3>Select Category</h3>
    {categories.map((category) => (
      <label key={category._id}>
        <input
          type="radio"
          placeholder="Categories (comma-separated IDs)"
          name="category"
          value={category._id}
          checked={updatedPlace.Categories === category._id}
          onChange={(e) => setUpdatedPlace({ ...updatedPlace, Categories: e.target.value })}
        />
        {category.Category}
      </label>
    ))}
    
    {/* Render Tag Radio Buttons */}
    <h3>Select Tag</h3>
    {tags.map((tag) => (
      <label key={tag._id}>
        <input
          type="radio"
          placeholder="Tags (comma-separated IDs)"
          name="tag"
          value={tag._id}
          checked={updatedPlace.Tags === tag._id}
          onChange={(e) => setUpdatedPlace({ ...updatedPlace, Tags: e.target.value })}
        />
        {tag.Tag}
      </label>
    ))}

      <Button onClick={handleUpdate}>Update Place</Button>
    </div>
  );
}
