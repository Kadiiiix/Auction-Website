import React, { useState } from "react";
import axios from "axios";

const CreateAuction = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    picture: "",
    name: "",
    condition: "",
    category: "",
    closingDate: "",
    //createdBy: currentUser.id,
    additionalPhotos: [],
    startingBid: "",
    allowInstantPurchase: false,
    description: "",
    location: "",
    age: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auctions",
        formData
      );
      console.log("Auction created:", response.data);
      // Handle success, redirect, or show a success message
    } catch (error) {
      console.error("Error creating auction:", error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Auction form fields */}
      <input
        type="text"
        name="picture"
        value={formData.picture}
        onChange={handleChange}
        placeholder="Picture URL"
      />
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="condition"
        value={formData.condition}
        onChange={handleChange}
        placeholder="Condition"
      />
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        placeholder="Category"
      />
      <input
        type="datetime-local"
        name="closingDate"
        value={formData.closingDate}
        onChange={handleChange}
        placeholder="Closing Date"
      />
      <input
        type="text"
        name="startingBid"
        value={formData.startingBid}
        onChange={handleChange}
        placeholder="Starting Bid"
      />
      <input
        type="checkbox"
        name="allowInstantPurchase"
        checked={formData.allowInstantPurchase}
        onChange={(e) =>
          setFormData({ ...formData, allowInstantPurchase: e.target.checked })
        }
      />
      <input
        type="text"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
      />
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />
      {/* Additional photos */}
      <input
        type="text"
        name="additionalPhotos"
        value={formData.additionalPhotos}
        onChange={handleChange}
        placeholder="Additional Photos (comma-separated URLs)"
      />
      <button type="submit">Create Auction</button>
    </form>
  );
};

export default CreateAuction;
