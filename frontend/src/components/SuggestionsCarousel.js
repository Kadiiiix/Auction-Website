import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import "../design/Carousel.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuctionItem from "./AuctionItem";

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

  return (
    <>
      <Carousel arrows className="arrows">
        {recommendations.map((product) => (
          <div className="contents" key={product._id}>
            <a
              href={`/auction/${product._id}`}
              onClick={(event) => handleItemClick(event, product._id)}
              className="no-underline"
            >
              <AuctionItem margin="0" item={product} />
            </a>
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default RecommendationsCarousel;
