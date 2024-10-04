"use client"; // Marking this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function MyPlaces() {
  const router = useRouter();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPlace, setNewPlace] = useState({
    Name: '',
    Description: '',
    Categories: [],
    Tags: [],
  });

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://localhost:3001/tourismGovernor/my-places');

        const data = await response.json();
        setPlaces(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const createPlace = async () => {
    try {
      const response = await fetch('http://localhost:3001/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify(newPlace),
      });
    
      const data = await response.json();
      setPlaces([...places, data]); // Update the places list with the new place
      setNewPlace({ Name: '', Description: '', Categories: [], Tags: [] }); // Reset the newPlace state
    } catch (err) {
      setError(err.message);
    }
  };

  const createTag = async () => {
    try {
      const response = await fetch('http://localhost:3001/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Tag: newTag }),
      });

      const data = await response.json();
      setTags([...tags, data]); // Update the tags list with the new tag
      setNewTag(''); // Reset the newTag state
    } catch (err) {
      setError(err.message);
    }
  };


  const [loadingDelete, setLoadingDelete] = useState(false);

  const deletePlace = async (id) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      setLoadingDelete(true);
      try {
        await fetch(`http://localhost:3001/places/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'},
        });
        setPlaces(places.filter(place => place._id !== id)); // Remove deleted place from the list
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDelete(false);
      }
    }
  };
  
  const startEdit = (place) => {
    // Redirect to the update page and pass the place data as query params
    router.push({
      pathname: `/${place._id}`,
    });
  };

  if (loading) {
    return <div>Loading your places...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!places.length) {
    return <div>No places found!</div>;
  }

  return (
    <div style={styles.container}>
    <h1>My Created Museums and Historical Places</h1>
  
    {/* Create Place Section */}
    <h2>Create a New Place</h2>
    <input
      type="text"
      placeholder="Name"
      value={newPlace.Name}
      onChange={(e) => setNewPlace({ ...newPlace, Name: e.target.value })}
    />
    <input
      type="text"
      placeholder="Description"
      value={newPlace.Description}
      onChange={(e) => setNewPlace({ ...newPlace, Description: e.target.value })}
    />
    <input
      type="text"
      placeholder="Type"
      value={newPlace.Type}
      onChange={(e) => setNewPlace({ ...newPlace, Type: e.target.value })}
    />
    <input
      type="text"
      placeholder="Location"
      value={newPlace.Location}
      onChange={(e) => setNewPlace({ ...newPlace, Location: e.target.value })}
    />
    <input
      type="text"
      placeholder="Opening Hours"
      value={newPlace.OpeningHours}
      onChange={(e) => setNewPlace({ ...newPlace, OpeningHours: e.target.value })}
    />
    <input
      type="text"
      placeholder="Pictures (comma-separated URLs)"
      value={newPlace.Pictures}
      onChange={(e) => setNewPlace({ ...newPlace, Pictures: e.target.value.split(',') })}
    />
    <input
      type="text"
      placeholder="Ticket Prices (JSON format)"
      value={newPlace.TicketPrices}
      onChange={(e) => setNewPlace({ ...newPlace, TicketPrices: JSON.parse(e.target.value) })}
    />
    <input
      type="text"
      placeholder="Tags (comma-separated IDs)"
      value={newPlace.Tags}
      onChange={(e) => setNewPlace({ ...newPlace, Tags: e.target.value.split(',') })}
    />
    <input
      type="text"
      placeholder="Categories (comma-separated IDs)"
      value={newPlace.Categories}
      onChange={(e) => setNewPlace({ ...newPlace, Categories: e.target.value.split(',') })}
    />
    <Button onClick={createPlace}>Create Place</Button>

     {/* Tag Creation Section */}
     <h2>Create a New Tag</h2>
      <input
        type="text"
        placeholder="New Tag (e.g., Monuments, Museums)"
        value={newTag}
        onChange={(e) => setNewTag(e.target.value)}
      />
      <Button onClick={createTag}>Create Tag</Button>
  
    <ul style={styles.placeList}>
      {places.map((place) => (
        <li key={place._id} style={styles.placeItem}>
          {place.Name}
          {place.Image && (
            <img
              src={place.Image}
              alt={place.Name}
              style={styles.image}
            />
          )}
          <p>Description: {place.Description}</p>
          <p>Type: {place.Type}</p>
          <p>Location: {place.Location}</p>
          <p>Opening Hours: {place.OpeningHours}</p>
          <p>Pictures: {place.Pictures.join(', ')}</p>
          <p>Ticket Prices: {JSON.stringify(place.TicketPrices)}</p>
          <p>Category: {place.Categories.join(', ')}</p>
          <p>Tags: {place.Tags.join(', ')}</p>
          <Button onClick={() => startEdit(place)}>View Place</Button>
          <Button onClick={() => deletePlace(place._id)}>Delete Place</Button>
        </li>
      ))}
    </ul>
  </div>
  );
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
