
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../design/AuctionPage.css';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Button, Modal, notification, Carousel } from 'antd';
import CommentSection from './Comments';
import ExtendAuctionModal from './ExtendAuctionModal';
import Caros from './SimilarItemsCarousel'
import Chatbot from './ChatBot';
const AuctionPage = ({setLoggedIn}) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [author, setAuthor] = useState("");
  const [authorsRate, setAuthorsRate] = useState(0);
  const role = localStorage.getItem("role");

  //const userId = localStorage.getItem("userId");
 const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

 const [extendModalVisible, setExtendModalVisible] = useState(false);
 const [closeModalVisible, setCloseModalVisible] = useState(false);

 const handleExtendButtonClick = () => {
    axios.post(
        `http://localhost:4000/api/notification/extension/${id}`
    );
   setExtendModalVisible(true);
 };

  const handleBidChange = (event) => {
    setBidAmount(event.target.value);
  };


  const handleCloseAuctionButtonClick = () => {
    setCloseModalVisible(true);
  };

  const handleConfirmCloseAuction = async () => {
    try {
      axios.post(`http://localhost:4000/api/notification/closing/${id}`);
      const response = await axios.put(`http://localhost:4000/api/auctions/${id}/close`);

      console.log(response.data.message);
      // Handle success or update UI accordingly
      setCloseModalVisible(false);
      notification.success({
        message: 'Close Successful',
        description: 'You have successfully closed your auction.',
      });
    } catch (error) {
      console.error("Error closing auction:", error);
      notification.error({
        message: 'Extend Failed',
        description: 'Error extending auction.',
      });
      // Handle error or show error message
    }
  };

 const handlePlaceBid = async () => {
  const amount = bidAmount;
   try {
     const auctionId = item._id;
     const currentUserId = userId; 
     const amount = bidAmount; 
     await axios.post(
       `http://localhost:4000/api/notification/outbid/${auctionId}`
     );
     const response = await axios.post(
       `http://localhost:4000/api/auctions/${auctionId}/placeBid/${currentUserId}/${amount}`
     );
      notification.success({
        message: 'Success',
        description: 'You have placed your bid.',
      });
   } catch (error) {
    if(amount<=item.highestBid){
      notification.error({
        message: 'Error',
        description: 'Your bid must be higher than the currently highest bid.',
      });
    }
    if(amount<=item.minimalBid){
      notification.error({
        message: 'Error',
        description: 'Your bid must be higher than the minimal bid.',
      });
    }
     console.error("Error placing bid:", error);
     }
   
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
        console.log(item);
        setLikeNumber(response.data.likedBy.length)
        setAuthorsRate(response.data.vendorRating)
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchAuction();
  });

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

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatRating = (authorsRate) => {
    // Check if authorsRate is defined before attempting to call toFixed()
    if (authorsRate) {
      return authorsRate.toFixed(2);
    } else {
      // Handle the case where authorsRate is undefined or not a number
      return "N/A"; // or any other appropriate value or message
    }
  };
  
  const renderAuctionInfo = () => {
    const imagesDisp = [item.picture, ...(item.additionalPhotos || [])];
    console.log("Images to display:", imagesDisp);

    return (
      <>
        <div className="information">
          {renderInfoBlock(
            "Vendor's Rating",
            formatRating(author.vendorRating)
          )}
          {renderInfoBlock("End date", formatDate(item.closingDate))}
          {author && (
            <div className="one-block">
              <p className="upper-title">Created By</p>
              <Link to={`/profile/${author._id}`} className="lower-title">
                {author.username}
              </Link>
            </div>
          )}
          {renderInfoBlock("Likes", item.likedBy.length)}{" "}
        </div>
      
        <div className="photo-bidding">
          <div className="carousel-container" >
              <Carousel arrows infinite={false} style={{ width: '100%',  maxHeight: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                {imagesDisp.map((src, index) => (
                  <div key={index}  style={{ maxWidth: '100%' }}>
                  <img
                    src={process.env.PUBLIC_URL + src}
                    alt={`Auction Item ${index}`}
                    style={{  maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                  />
                </div>
               ))}
              </Carousel>
          </div>

          <div className="bidding">
            <div className="highest">
              <p className="bid-title">Highest Bid</p>
              <p className="highest-bid">{item.highestBid} KM</p>
            </div>
            <hr className="separator" />
            <div className="minimal">
              <p className="bid-title">Minimal Bid</p>
              <p className="minimal-bid">{item.startingBid} KM</p>
            </div>
            <div className="placing-bids">
              <Button className="bid" onClick={handlePlaceBid} disabled={role==="admin" || userId===item.createdBy}>
                Place Bid
              </Button>
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
                    disabled={!setLoggedIn || role==="admin"}
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
            {userId === author._id ? (
              <>
                <Button
                  onClick={handleExtendButtonClick}
                  className="extend-close"
                >
                  Extend Auction
                </Button>
                <ExtendAuctionModal
                  auctionId={id}
                  visible={extendModalVisible}
                  setVisible={setExtendModalVisible}
                />
                <Button danger onClick={handleCloseAuctionButtonClick}>
                  Close Auction
                </Button>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="additional">{renderAdditionalInfo()}</div>
        
          <div className="carousel">
            <Caros auctionId={item._id} />
          </div>
       
        <div className="comments">
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

  return <div className="auction-container">
              <h2>{item?.name}</h2>
              {item && renderAuctionInfo()}
                
            <Modal
                title="Close Auction Confirmation"
                visible={closeModalVisible}
                onCancel={() => setCloseModalVisible(false)}
                onOk={handleConfirmCloseAuction}
              >
                <p>Are you sure you want to close this auction?</p>
              </Modal>
          </div>;
};

export default AuctionPage;
