import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionItem from "./AuctionItem";
import { Link, useParams } from "react-router-dom";
import { Pagination, Button } from "antd";
import "../design/FavoritesPage.css";

const FavoritesPage = () => {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [favorites, setFavorites] = useState([]);
  const [author, setAuthor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${id}/favorites`
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${id}`
        );
        setAuthor(response.data.username);
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchUser();
  }, [id]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFavorites = favorites.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      {userId === id ? (
        <h1 className="page-title">My Favorite Auctions</h1>
      ) : (
        <h1 className="page-title">{author}'s Favorite Auctions</h1>
      )}
      <ul className="favorite-list">
        {currentFavorites.map((favorite) => (
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
      <div className="pagination">
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={favorites.length}
          pageSize={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default FavoritesPage;
