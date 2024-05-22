import React from "react";
import "../design/HomePage.css";
import ItemListingsPage from "../components/ItemListingsPage";
import FilterForm from "../components/FilterForm";

const HomePage = ({ searchQuery }) => {
  return (
    <div className="containerHome">
    
      <ItemListingsPage searchQuery={searchQuery} />
    </div>
  );
};

export default HomePage;
