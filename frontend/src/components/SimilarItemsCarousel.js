import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import "../design/Carousel.css";
import { Link, useNavigate } from "react-router-dom";
import RecommendedItem from "./RecommendedItem";

const Caros = ({ auctionId }) => {
  const [similarProducts, setSimilarProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/auctions/similar/${auctionId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch similar products");
        }
        const data = await response.json();
        setSimilarProducts(data);
      } catch (error) {
        console.error("Error fetching similar products:", error);
      }
    };

    fetchSimilarProducts();
  }, [auctionId]);
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

  const groupedRecommendations = chunkArray(similarProducts, 4);
  return (
    <>
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
    </>
  );
};

export default Caros;
