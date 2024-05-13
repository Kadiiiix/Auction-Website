import React, { useState } from 'react';
import axios from 'axios';

const SearchAuctions = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/auctions/search?query=${query}`);
      setResults(response.data);
      setError(null);
    } catch (error) {
      setError('An error occurred while fetching data');
      setResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search auctions"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      {results.length === 0 ? (
        <p>No matching auctions found</p>
      ) : (
        <ul>
          {results.map((auction) => (
            <li key={auction._id}>{auction.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchAuctions;
