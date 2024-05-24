import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionItem from "./AuctionItem";
import { Link, useParams } from "react-router-dom";
import { Radio, Space, Pagination } from "antd";
import "../design/FavoritesPage.css";

const UsersAuctionsPage = () => {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const [auctions, setAuctions] = useState([]);
  const [author, setAuthor] = useState("");
  const [filter, setFilter] = useState("ongoing"); // 'ongoing' or 'closed'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/auctions`);
        const filteredAuctions = response.data.filter(
          (auction) => auction.createdBy === id
        );
        setAuctions(filteredAuctions);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    };

    fetchAuctions();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${id}`
        );
        setAuthor(response.data.username);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [id]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
    window.scrollTo(0, 0); // Scroll back to top
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll back to top
  };

  const filteredAuctions = auctions.filter((auction) => {
    const currentDate = new Date();
    const closingDate = new Date(auction.closingDate);

    if (filter === "ongoing") {
      return closingDate >= currentDate;
    } else if (filter === "closed") {
      return closingDate < currentDate;
    }

    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAuctions = filteredAuctions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="favorite-list">
      {userId === id ? (
        <div className="page-title">
          <h1>My Auctions</h1>
          <Space style={{ marginBottom: 16 }}>
            <Radio.Group value={filter} onChange={handleFilterChange}>
              <Radio.Button value="ongoing">Ongoing</Radio.Button>
              <Radio.Button value="closed">Closed</Radio.Button>
            </Radio.Group>
          </Space>
        </div>
      ) : (
        <h1 className="page-title">{author}'s Auctions</h1>
      )}

      <ul className="list-elements">
        {currentAuctions.map((auction) => (
          <li key={auction._id}>
            <Link to={`/auction/${auction._id}`} className="no-underline">
              <AuctionItem item={auction} />
            </Link>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={filteredAuctions.length}
          pageSize={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default UsersAuctionsPage;
