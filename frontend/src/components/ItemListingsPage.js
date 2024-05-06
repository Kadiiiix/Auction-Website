import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemListingsPage = () => {
  const [auctionListings, setAuctionListings] = useState([]);

  useEffect(() => {
    const fetchAuctionListings = async () => {
      try {
        
        const response = await axios.get("http://localhost:4000/api/auctions");
        setAuctionListings(response.data);
      } catch (error) {
        console.error("Error fetching auction listings:", error);
      }
    };

    fetchAuctionListings();
  }, []);

  return (
    <div className="item-listings-page">
      <h2>Popular Auctions</h2>
      <div className="auction-items">
        {auctionListings.map((listing) => (
          <div key={listing._id}>
            {/* Render auction listing details */}
            <p>Title: {listing.title}</p>
            <p>Highest Bid: {listing.highestBid}</p>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemListingsPage;
