import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionItem from "./AuctionItem";
import { Button } from "antd";
import FilterForm from "./FilterForm";
import { Link } from "react-router-dom";

const ItemListingsPage = () => {
  const [auctionListings, setAuctionListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const auctionsPerPage = 5;

  // Fetch all auction listings initially
  useEffect(() => {
    fetchAuctionListings();
  }, []);

  // Function to fetch auction listings
  const fetchAuctionListings = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auctions");
      setAuctionListings(response.data);
    } catch (error) {
      console.error("Error fetching auction listings:", error);
    }
  };

  // Function to handle received filtered auction items
  const handleFilteredAuctions = (filteredAuctions) => {
    setAuctionListings(filteredAuctions);
  };

  // Pagination handlers
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

  // Calculate current auctions based on pagination
  const indexOfLastAuction = currentPage * auctionsPerPage;
  const indexOfFirstAuction = indexOfLastAuction - auctionsPerPage;
  const currentAuctions = auctionListings.slice(
    indexOfFirstAuction,
    indexOfLastAuction
  );

  return (
    <div>
      <div className="filter-form-container">
        <FilterForm onFilter={handleFilteredAuctions} />
      </div>
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
    </div>
  );
};

export default ItemListingsPage;
