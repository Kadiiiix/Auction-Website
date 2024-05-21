import React, { useState, useEffect } from 'react';
import { Rate, notification } from 'antd';
import axios from 'axios';

const Rating = ({ id, userId }) => {
  // State to hold the vendor's rating
  const [vendorsRating, setVendorsRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [autor, setAutor] = useState("");
  const [raters, setRaters] = useState([]);

  // Function to handle the change in rating
  const handleRatingChange = (rating) => {
    // Update the vendorsRating state with the selected rating
    setVendorsRating(rating);

    // Send the rating to the backend
    sendRatingToBackend(rating);
  };

  // Function to send the rating to the backend
  const sendRatingToBackend = async (rating) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/users/${id}/rate`,
        { rating: parseInt(rating), raterId: userId }, // Send rating and raterId in the request body
        {
          headers: {
            'Content-Type': 'application/json', // Set content type to JSON
          },
        }
      );
      // Handle the response if needed

      notification.success({
        message: 'Rating Success',
        description: 'Vendor rated successfully.',
      });

      // Update ratedBy state to include the current userId
      setRaters([...raters, userId]);
    } catch (error) {
      // Handle errors if the request fails
      console.error('Error sending rating to backend:', error);
      notification.error({
        message: 'Rating Failed',
        description: 'Error rating vendor.',
      });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${id}`
        );
        setAutor(response.data.username);
        setRating(response.data.vendorRating);
        setRaters(response.data.ratedBy);
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchUser();
  },);

  // Check if userId is in the ratedBy array
  const alreadyRated = raters.includes(userId);

  return (
    <>
      {userId === id ? (<p>You cannot rate yourself.</p>) : (<>
        {alreadyRated ?(<p>You have rated {autor}!</p>) : (<>
        <p>Rate {autor}:</p>
        <Rate onChange={handleRatingChange} />
        </>)  }
      </>)}
      {rating !== 0 && (
      <>
        <p>{autor}'s rate: {rating.toFixed(1)}</p>
        <Rate allowHalf disabled defaultValue={parseInt(rating)} />
      </>
    )}
    </>
  );
};

export default Rating;
