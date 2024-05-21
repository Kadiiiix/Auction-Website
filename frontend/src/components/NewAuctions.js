import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuctionItem from "./AuctionItem";
import { Button } from "antd";
import "../design/PopularItems.css";

const NewAuctions = ({ searchQuery }) => {
  const [auctionListings, setAuctionListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const auctionsPerPage = 5;

  useEffect(() => {
    const fetchAuctionListings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/auctions/recent"
        );
        setAuctionListings(response.data);
      } catch (error) {
        console.error("Error fetching auction listings:", error);
      }
    };

    fetchAuctionListings();
  }, []);

  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = auctionListings.slice(
    indexOfFirstAuction,
    indexOfLastAuction
  );

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(auctionListings.length / auctionsPerPage)
      )
    );
  };

  return (
    <div className="item-listings-page">
      <div className="auction-items">
        {currentAuctions.map((listing) => (
          <Link
            to={`/auction/${listing._id}`}
            key={listing._id}
            className="no-underline"
          >
            <AuctionItem item={listing} />
          </Link>
        ))}
      </div>
      <div className="pagination">
        <div className="centered-buttons">
          <Button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>{currentPage}</span>
          <Button
            onClick={handleNextPage}
            disabled={indexOfLastAuction >= auctionListings.length}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAuctions;
