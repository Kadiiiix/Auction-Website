import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuctionItem from "./AuctionItem";
import { Pagination } from "antd";
import FilterForm from "./FilterForm";
import "../design/NewAndPopularAuctions.css";

const PopularItems = ({ searchQuery }) => {
  const [auctionListings, setAuctionListings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const auctionsPerPage = 5;

  useEffect(() => {
    const fetchAuctionListings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/auctions/popular"
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

  const onPageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll back to top
  };

  const handleFilteredAuctions = (filteredAuctions) => {
    setAuctionListings(filteredAuctions);
  };

  return (
    <div>
      <div className="filter-form-container">
        <FilterForm onFilter={handleFilteredAuctions} />
      </div>
      <div className="cont">
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
          <Pagination
            current={currentPage}
            onChange={onPageChange}
            total={auctionListings.length}
            pageSize={auctionsPerPage}
            showSizeChanger={false} // Hide the page size changer if not needed
          />
        </div>
      </div>
    </div>
  );
};

export default PopularItems;
