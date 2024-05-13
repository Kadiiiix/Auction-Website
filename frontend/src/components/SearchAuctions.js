import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AuctionItem from "./AuctionItem";
import { Link } from "react-router-dom";

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extracting search query from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // Fetch search results from the API
        const response = await axios.get(`http://localhost:4000/api/auctions/search?query=${query}`);
        setSearchResults(response.data);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching data");
        setLoading(false);
      }
    };

    fetchSearchResults();

    // Cleanup function
    return () => {
      // Cleanup if needed
    };
  }, [query]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
<div className="item-listings-page">
      <div className="auction-items">
        {searchResults.map((listing) => (
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

export default SearchResultsPage;
