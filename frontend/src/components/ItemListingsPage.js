// ItemListingsPage.js
import React from "react";
import { Link } from "react-router-dom";
import AuctionItem from "./AuctionItem";


const ItemListingsPage = ({ items }) => {
  return (
    <div className="item-listings-page">
      <h2>Popular Auctions</h2>
      <div className="auction-items">
        {items.map((item) => (
          <Link key={item.id} to={`/items/${item.id}`}>
            <AuctionItem item={item} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ItemListingsPage;
