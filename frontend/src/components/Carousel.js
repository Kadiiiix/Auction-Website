import React, { useState, useEffect } from "react";
import { Carousel } from "antd";
import "../design/Carousel.css";
import { Link, useNavigate } from "react-router-dom";
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
    window.location.reload(); // To force re-render the page
  };
  return (
    <Carousel arrows className="arrows">
      {similarProducts.map((product) => (
        <div key={product._id}>
          <a
            href={`/auction/${product._id}`}
            onClick={(event) => handleItemClick(event, product._id)}
            className="no-underline"
          >
            {product.picture ? (
              <img
                className="auction-photo"
                src={process.env.PUBLIC_URL + product.picture}
                alt={product.name}
              />
            ) : (
              <div className="no-image-placeholder">
                <h3 className="contentStyle">{product.name}</h3>
              </div>
            )}
          </a>
        </div>
      ))}
    </Carousel>
  );
};

export default Caros;
