import React from "react";
import "../design/HomePage.css";
import ItemListingsPage from "../components/ItemListingsPage";

const HomePage = ({ searchQuery }) => {
  return (
    <div className="containerHome">
      <ItemListingsPage searchQuery={searchQuery} />
    </div>
  );
};

export default HomePage;
