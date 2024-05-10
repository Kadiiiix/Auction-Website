import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionItem from "./AuctionItem";
import { Link } from "react-router-dom";
import "../design/FavoritesPage.css"; 

const FavoritesPage = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}/favorites`
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div>
      <h1 className="page-title">My Favorite Auctions</h1>
      <ul className="favorite-list">
        {favorites.map((favorite) => (
          <li key={favorite._id}>
            <Link
              to={`/auction/${favorite._id}`}
              key={favorite._id}
              className="no-underline"
            >
              <AuctionItem item={favorite} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritesPage;
