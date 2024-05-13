import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

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
        const response = await axios.get(`/api/auctions/search?query=${query}`);
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
    <div>
      <h2>Search Results for: {query}</h2>
      {searchResults.length === 0 ? (
        <p>No matching auctions found</p>
      ) : (
        <ul>
          {searchResults.map((auction) => (
            <li key={auction.id}>{auction.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsPage;
