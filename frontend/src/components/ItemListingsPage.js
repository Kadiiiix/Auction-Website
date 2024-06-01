import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionItem from "./AuctionItem";
import FilterForm from "./FilterForm";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import Caros from "./SuggestionsCarousel";

import "../design/NewAndPopularAuctions.css";

const role = localStorage.getItem("role");

const ItemListingsPage = () => {
  const [auctionListings, setAuctionListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const auctionsPerPage = 5;
  const userId = localStorage.getItem("userId");
  const isLoggedIn = userId ? true : false;

  // Fetch all auction listings initially
  useEffect(() => {
    fetchAuctionListings();
  }, []);

  // Function to fetch auction listings
  // Function to fetch auction listings
  const fetchAuctionListings = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/auctions");
      const currentTime = new Date().getTime(); // Get current time in milliseconds

      // Filter auctions whose closing date is in the future
      const Auctions = response.data.filter((auction) => {
        const closingTime = new Date(auction.closingDate).getTime();
        return closingTime > currentTime;
      });

      setAuctionListings(Auctions);
    } catch (error) {
      console.error("Error fetching auction listings:", error);
    }
  };

  // Function to handle received filtered auction items
  const handleFilteredAuctions = (filteredAuctions) => {
    setAuctionListings(filteredAuctions);
  };

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll back to top
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

      <div className="conj">
        {isLoggedIn && role!=="admin" ? ( 
          <div>
         <h2 className="paragraph">Recommended for You!</h2>
          <div className="recommendations-carousel">
           
            <Caros userId={userId} />
          </div>
          </div>
        ) : null}

        <div className="auctions">
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
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={auctionListings.length}
            pageSize={auctionsPerPage}
            showSizeChanger={false} // Hide the page size changer if not needed
          />
        </div>
      </div>
    </div>
  );
};

export default ItemListingsPage;
