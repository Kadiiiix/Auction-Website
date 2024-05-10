import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../design/AuctionPage.css";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Button } from "antd";

const AuctionPage = ({ setLoggedIn }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeNumber, setLikeNumber] = useState("");

  const handleBidChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handlePlaceBid = () => {
    // Implement the logic to place bid
    console.log("Placing bid:", bidAmount);
  };

  const handleAddToFavorites = async () => {
    try {
      // Retrieve the token and userId from local storage
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // Configure headers with the token
      const headers = {
        "Content-Type": "application/json", // Set content type if needed
      };

      // Make the API call using fetch
      const response = await fetch(
        `http://localhost:4000/api/favorite/add/${id}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: null,
        }
      );

      // Check if the request was successful
      if (!response.ok) {
        throw new Error("Failed to add auction to favorites");
      }

      // Parse the response JSON data
      const responseData = await response.json();

      console.log(responseData);
      setLiked(true);
      // Handle success or update UI accordingly
    } catch (error) {
      console.error("Error adding auction to favorites:", error);
      // Handle error or show error message
    }
  };

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/auctions/${id}`
        );
        setItem(response.data);
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchAuction();
  }, [id]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}/favorites`
        );
        const likes = response.data;

        const auctionIdToCheck = id;
        const auctionExists = likes.some(
          (auction) => auction._id === auctionIdToCheck
        );

        if (auctionExists) {
          setLiked(true);
        } else {
          setLiked(false);
          console.log(liked);
        }
      } catch (error) {
        console.error("error fetching likes:", error);
      }
    };

    fetchLikes();
  }, []);

  const renderAuctionInfo = () => {
    return (
      <>
        <div className="information">
          {renderInfoBlock("Item ID", item._id)}
          {renderInfoBlock("End date", item.closingDate)}
          {renderInfoBlock("Author", "bice autor")}{" "}
          {/* Replace with author information */}
          {renderInfoBlock("Likes", item.likedBy.length)}{" "}
          {/* Replace with likes information */}
        </div>
        <div className="photo-bidding">
          <img className="auction-photo" src={item.picture} alt={item.name} />
          <div className="bidding">
            <div className="highest">
              <p className="bid-title">Highest Bid</p>
              <p className="highest-bid">1000 KM</p>
            </div>
            <hr className="separator" />
            <div className="minimal">
              <p className="bid-title">Minimal Bid</p>
              <p className="minimal-bid">{item.startingBid} KM</p>
            </div>
            <div className="placing-bids">
              <Button className="bid">Place Bid</Button>
              <input
                className="input"
                type="number"
                value={bidAmount}
                onChange={handleBidChange}
                placeholder="Enter bid"
              />
            </div>
            <div className="favorite">
              {liked ? ( // If setLiked is true
                <>
                  <Button disabled={!setLoggedIn} className="likeButton">
                    {" "}
                    {/* Changed from loggedIn to isLoggedIn */}
                    <HeartFilled />
                  </Button>
                  <p className="text">You have liked this auction!</p>
                </>
              ) : (
                // If setLiked is false
                <>
                  <Button
                    onClick={handleAddToFavorites}
                    className="likeButton"
                    disabled={!setLoggedIn}
                  >
                    {" "}
                    {/* Changed from loggedIn to isLoggedIn */}
                    <HeartOutlined />
                  </Button>
                  {setLoggedIn ? (
                    <>
                      <p className="text">Like this auction</p>
                    </>
                  ) : (
                    <>
                      <p className="text">
                        <a href="http://localhost:3000/login">Login</a> to like
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="more">
          <div className="description-container">
            <h3 className="subtitle">Description</h3>
            {item.description && (
              <p className="description">{item.description}</p>
            )}
            {item.condition && (
              <p className="description">Condition: {item.condition}</p>
            )}
            {item.location && (
              <p className="description">Location: {item.location}</p>
            )}
            {/* Add more conditional rendering for other optional fields */}
          </div>
        </div>
      </>
    );
  };

  const renderInfoBlock = (upperTitle, lowerTitle) => {
    return (
      <div className="one-block">
        <p className="upper-title">{upperTitle}</p>
        <p className="lower-title">{lowerTitle}</p>
      </div>
    );
  };

  return <div className="auction-container">{item && renderAuctionInfo()}</div>;
};

export default AuctionPage;
