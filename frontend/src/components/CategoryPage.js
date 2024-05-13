import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams} from "react-router-dom";
import AuctionItem from "./AuctionItem";
import "../design/ItemListingsPage.css";
 
const CategoryPage = ({}) => {
  const [category, setCategory] = useState([]);
  const { query } = useParams(); 
  useEffect(() => {
    const fetchCategory = async () => {
      try {
       const response = await axios.get(
         `http://localhost:4000/api/auctions/category/${query}`
       );

        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching auction listings:", error);
      }
    };

    fetchCategory();
  }, []);



  return (
    <div className="item-listings-page">
      <div className="auction-items">
        {category.map((listing) => (
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

export default CategoryPage;
