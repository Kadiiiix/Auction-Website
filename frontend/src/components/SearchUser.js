import React, { useState } from 'react';
import axios from 'axios';
import { Input, List } from 'antd';

const SearchUser = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/search?query=${e.target.value}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="search-user">
      <Input
        placeholder="Search for a user..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      {searchResults.length > 0 && (
        <List
          bordered
          dataSource={searchResults}
          renderItem={(user) => (
            <List.Item onClick={() => onUserSelect(user)}>
              {user.username}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchUser;
