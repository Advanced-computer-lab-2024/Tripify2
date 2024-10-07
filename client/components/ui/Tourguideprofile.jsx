"use client";
import React from "react";
import { fetcher } from "@/lib/fetch-client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function Tourguideprofile({ tourguide, tourguideid, role }) {
  const router = useRouter();
  const [resultTest, setResultTest] = useState([]);
  let num = 0;
  const [pagestate, setPagestate] = useState("Read");
  const [allitineraries, setItineraries] = useState([]);
  const [formData, setFormData] = useState({
    MobileNumber: tourguide.MobileNumber,
    YearsOfExperience: tourguide.YearsOfExperience,
    PreviousWork: tourguide.PreviousWork,
    Accepted: tourguide.Accepted,
  });
  //   console.log(formData);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const documentlist = tourguide.Documents.map((doc) => {
    num++;
    return (
      <li>
        {num}.{doc}
      </li>
    );
  });

  useEffect(() => {
    const fetchitinerary = async () => {
      try {
        const response = await fetcher(`/itineraries`);
        const data = await response.json();
        setItineraries(data);
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
      }
    };
    fetchitinerary();
  }, []);

  let itinerarylist = <li>loading...</li>;
  if (allitineraries.length !== 0) {
    //let result = [];
    // tourguide.Itineraries.map((itinerary) => {
    //   const found = allitineraries.find((one) => one._id == itinerary);
    //   //const found = allitineraries.filter((one) => one._id === itinerary);
    //   //   result.push(found);
    //   //   setResultTest((prevResult) => [...prevResult, found]);
    //   console.log("=,-=-=-=-==-==-=-=-=");
    //   console.log(found);
    //   console.log("=-=-=-=-==-==-=-=-=");
    // });
    // itinerarylist = result.map((one) => (
    //   <li>
    //     <h3>Name:{one.Name}</h3>
    //     <h3>StartDate:{one.StartDate}</h3>
    //     <h3>EndDate:{one.EndDate}</h3>
    //   </li>
    // ));
    // console.log("---------------------------");
    // console.log(tourguide.Itineraries);
    // console.log("---------------------------");

    itinerarylist = tourguide.Itineraries.map((itinerary) => {
      //   console.log(itinerary);
      return (
        <li>
          <h3>Name: {itinerary.Name}</h3>
          {/* <h3>StartDate:{itinerary.StartDate}</h3>
            <h3>EndDate:{itinerary.EndDate}</h3> */}
        </li>
      );
    });
    // itinerarylist = tourguide.Itineraries.map(itinerary => {

    // });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData));
    try {
      const response = await fetcher(`/tourguides/${tourguideid}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setPagestate("Read");
        alert("Successfully updated a tour guide");
        // Redirect back to the activities list page
      } else {
        console.log("PROBLEM");
        console.error("Error updating tour guide");
      }
    } catch (error) {
      console.error("Failed to update a tour guide:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-6 gap-4">
      {tourguide.Accepted && allitineraries && pagestate == "Read" ? (
        <div className="border border-black rounded-md p-4 flex flex-col gap-4 min-w-96">
          <h1 className="text-2xl">
            <strong>My Profile</strong>
          </h1>
          <div>
            <strong>MobileNumber:</strong>
            <h2>{tourguide.MobileNumber}</h2>
          </div>

          <hr />
          <div>
            <strong>YearsOfExperience:</strong>
            <h2>
              {tourguide.YearsOfExperience !== 0
                ? tourguide.YearsOfExperience
                : "No experience"}
            </h2>
          </div>
          <hr />
          <div>
            <strong>PreviousWork:</strong>
            <h2>
              {tourguide.PreviousWork !== null
                ? tourguide.PreviousWork
                : "No previous work"}
            </h2>
          </div>

          <hr />
          <div>
            <strong>Documents:</strong>
            <ul>{documentlist}</ul>
          </div>
          <hr />
          <div>
            <strong>Itineraries:</strong>
            <ul className="flex flex-col gap-2">{itinerarylist}</ul>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => setPagestate("Edit")}
          >
            edit profile
          </button>
        </div>
      ) : tourguide.Accepted && pagestate == "Edit" ? (
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl">
            <strong>Edit Profile</strong>
          </h1>
          <div>
            <label>
              <strong>New Mobile Number:</strong>
              <input
                type="number"
                name="MobileNumber"
                value={formData.MobileNumber}
                onChange={handleInputChange}
                className="border p-2 w-full mb-4"
                placeholder={`old: ${tourguide.MobileNumber}`}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <strong>New Years Of Experience:</strong>
              <input
                type="number"
                name="YearsOfExperience"
                value={formData.YearsOfExperience}
                onChange={handleInputChange}
                className="border p-2 w-full mb-4"
                placeholder={`old: ${tourguide.YearsOfExperience}`}
                required
              />
            </label>
          </div>
          <div>
            <label>
              <strong>New Previous Work: (if any) </strong>
              <input
                type="text"
                name="PreviousWork"
                value={formData.PreviousWork}
                onChange={handleInputChange}
                className="border p-2 w-full mb-4"
                placeholder={`old: ${tourguide.PreviousWork}`}
              />
            </label>
          </div>

          {role == "Admin" && (
            <div>
              <label>
                <strong>Accepted:</strong>
                <input
                  type="file"
                  name="Accepted"
                  value={formData.Accepted}
                  onChange={handleInputChange}
                  className="border p-2 w-full mb-4"
                  required
                />
              </label>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Edit
          </button>
        </form>
      ) : (
        <h1>You are NOT accepted by the system</h1>
      )}
    </div>
  );
}

export default Tourguideprofile;
