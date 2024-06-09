import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import "../design/Carousel.css";
import { useNavigate } from "react-router-dom";
import RecommendedItem from "./RecommendedItem";

const RecommendationsCarousel = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/users/recommendations/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [userId]);

  const handleItemClick = (event, productId) => {
    event.preventDefault();
    navigate(`/auction/${productId}`);
    window.location.reload();
  };

  // Function to group recommendations into chunks of 3
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const groupedRecommendations = chunkArray(recommendations, 3);

  return (
    <Carousel arrows className="arrows">
      {groupedRecommendations.map((group, index) => (
        <div className="recommended-container">
        <div className="carousel-group" key={index}>
          {group.map((product) => (
            <div className="carousel-item" key={product._id}>
              <a
                href={`/auction/${product._id}`}
                onClick={(event) => handleItemClick(event, product._id)}
                className="no-underline"
              >
                <RecommendedItem item={product} />
              </a>
            </div>
          ))}
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default RecommendationsCarousel;
