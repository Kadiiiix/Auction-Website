import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AuctionItem from "./AuctionItem";
import { Pagination } from "antd";
import "../design/ItemListingsPage.css";

const CategoryPage = () => {
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 5;
  const { query } = useParams();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auctions/category/${query}`
        );
        setCategory(response.data);
        setTotalItems(response.data.length);
      } catch (error) {
        console.error("Error fetching auction listings:", error);
      }
    };

    fetchCategory();
  }, [query]);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = category.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="item-listings-page">
      <div className="auction-items">
        {currentItems.map((listing) => (
          <Link
            to={`/auction/${listing._id}`}
            key={listing._id}
            className="no-underline"
          >
            <AuctionItem item={listing} />
          </Link>
        ))}
      </div>
      <div className="pagination">
        <Pagination
          current={currentPage}
          onChange={onPageChange}
          total={totalItems}
          pageSize={itemsPerPage}
          showSizeChanger={false} // Hide the page size changer if not needed
        />
      </div>
    </div>
  );
};

export default CategoryPage;
