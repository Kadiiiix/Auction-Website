import React, { useState } from 'react';
import { Rate, notification } from 'antd';
import axios from 'axios';

const Rating = ({id}) => {
  // State to hold the vendor's rating
  const [vendorsRating, setVendorsRating] = useState(0);

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
      // Make a POST request to send the rating to the backend
      const response = await axios.post(`http://localhost:4000/api/users/${id}/${rating}`, {

      });

      // Handle the response if needed
      console.log(response.data);
      notification.success({
        message: 'Rating Success',
        description: 'Vendor rated successfully.',
      });
    } catch (error) {
      // Handle errors if the request fails
      console.error('Error sending rating to backend:', error);
      notification.error({
        message: 'Rating Failed',
        description: 'Error rating vendor.',
      });
    }
  };

  return <Rate onChange={handleRatingChange} />;
};

export default Rating;
