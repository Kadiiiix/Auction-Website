
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../design/AuctionPage.css';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Button } from 'antd';
import CommentSection from './Comments';

const AuctionPage = ({setLoggedIn}) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [author, setAuthor] = useState("");
  const userId = localStorage.getItem("userId");

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
      setLikeNumber(likeNumber+1);
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
        setLikeNumber(response.data.likedBy.length)
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchAuction();
  },);

  const handleRemoveFromFavorites= async () => {
    try {
      const headers = {
        "Content-Type": "application/json", 
      };

      const response = await fetch(
        `http://localhost:4000/api/favorite/remove/${id}/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: null,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove auction from favorites");
      }
      const responseData = await response.json();

      console.log(responseData);
      setLiked(false);
      setLikeNumber(likeNumber-1);
    } catch (error) {
      console.error("Error removing auction from favorites:", error);
      
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${item.createdBy}`
        );
        setAuthor(response.data);
        console.log(author);
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchUser();
  }, [item]);


  

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
        }
      } catch (error) {
        console.error("error fetching likes:", error);
      }
    };
    fetchLikes();
  });

  const renderAuctionInfo = () => {
    return (
      <>
        <div className="information">
          {renderInfoBlock("Item ID", item._id)}
          {renderInfoBlock("End date", item.closingDate)}
          {author && (
            <div className="one-block">
              <p className="upper-title">Author</p>
              <Link to={`/profile/${author._id}`} className="lower-title">{author.username}</Link>
            </div>
          )}
          {renderInfoBlock("Likes", item.likedBy.length, )}{" "}
        </div>
        <div className="photo-bidding">
          <img className='auction-photo' src={process.env.PUBLIC_URL + '/dresser.png'} alt="Dresser" />
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
                  <Button
                    onClick={handleRemoveFromFavorites}
                    disabled={!setLoggedIn}
                    className="likeButton"
                  >

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
        <div className='additional'>
        {renderAdditionalInfo()}
        </div>
        <div className='comments'>
        {item && <CommentSection auctionId={id} />}
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

  const renderAdditionalInfo = () => {
    const auctionProperties = [
      { label: "Description", value: item?.description },
      { label: "Condition", value: item?.condition },
      { label: "Category", value: item?.category },
      { label: "Instant Purchase Available", value: item?.allowInstantPurchase ? "Yes" : "No" },
      { label: "Location", value: item?.location },
      { label: "Age", value: item?.age },
      // Add more properties as needed
    ];

    return (
      <div className="more">
        <div className="description-container">
          <h3 className="subtitle">Additional Information</h3>
          {auctionProperties.map((property, index) => (
            <p key={index} className="description">
              <strong>{property.label}:</strong> {property.value}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return <div className="auction-container">{item && renderAuctionInfo()}</div>;
};

export default AuctionPage;
