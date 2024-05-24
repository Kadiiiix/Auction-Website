import React from "react";
import "../design/HomePage.css";
import ItemListingsPage from "../components/ItemListingsPage";
import FilterForm from "../components/FilterForm";
import Chatbot from "./ChatBot";

const HomePage = ({ searchQuery }) => {
  return (
    <div className="containerHome">
    
      <ItemListingsPage searchQuery={searchQuery} />
      <Chatbot></Chatbot>
    </div>
  );
};

export default HomePage;
