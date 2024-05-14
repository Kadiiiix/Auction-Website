import React, { useState, useEffect } from "react";
import axios from "axios";
import AuctionItem from "./AuctionItem";
import { Link, useParams } from "react-router-dom";
import "../design/FavoritesPage.css"; 

const UsersAuctionsPage = () => {
  const {id} = useParams();
  const userId = localStorage.getItem("userId");
  const [auctions, setAuctions] = useState([]);
  const [author, setAuthor] = useState("");
  

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auctions`
        );
        const filteredAuctions = response.data.filter(auction => auction.createdBy === id);
        setAuctions(filteredAuctions);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchAuctions();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await axios.get(
                `http://localhost:4000/api/users/${id}`
            );
            setAuthor(response.data.username);
        } catch (error) {
            console.error("Error fetching an auction");
        }
    };
    fetchUser();
}, []);

  return (
    <div>
      {userId===id ? (
        <h1 className="page-title">My Auctions</h1>
      ):(
        <h1 className="page-title">{author}'s Auctions</h1>
      )}
      <ul className="favorite-list">
        {auctions.map((auction) => (
          <li key={auction._id}>
            <Link
              to={`/auction/${auction._id}`}
              key={auction._id}
              className="no-underline"
            >
              <AuctionItem item={auction} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersAuctionsPage;
