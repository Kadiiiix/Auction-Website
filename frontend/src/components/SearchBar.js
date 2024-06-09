import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import "../design/SearchBar.css";
import { SearchOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const SearchBar = ({ searchQuery, handleSearchChange, loggedIn, role }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  const redirectCreate = () => {
    navigate('/create');
  }

  return (
    <div className="SearchBar">
      <form className="bar" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
            name="search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </form>
      <Button className='create-button' onClick={redirectCreate} disabled={!loggedIn || role==="admin"}>
        <PlusSquareOutlined />Create Auction
      </Button>
    </div>
  );
};

export default SearchBar;
