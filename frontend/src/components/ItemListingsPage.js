import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AuctionItem from "./AuctionItem";
import "../design/ItemListingsPage.css";

const ItemListingsPage = ({ searchQuery }) => {
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

  const filteredAuctionListings = searchQuery
    ? auctionListings.filter((listing) =>
        listing.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : auctionListings;

  return (
    <div className="item-listings-page">
      <div className="auction-items">
        {filteredAuctionListings.map((listing) => (
          <Link
            to={`/auction/${listing._id}`}
            key={listing._id}
            className="no-underline"
          >
            <AuctionItem item={listing} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemListingsPage;
