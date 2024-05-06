import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionItem from "./AuctionItem"; // Import the AuctionItem component

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
      <div className="auction-items">
        {auctionListings.map((listing) => (
          <AuctionItem key={listing._id} item={listing} /> 
        ))}
      </div>
    </div>
  );
};

export default ItemListingsPage;
