import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../design/AuctionPage.css';
import { HeartOutlined, HeartFilled, WarningOutlined } from '@ant-design/icons';
import { Button, Modal, notification, Form, Input, Select } from 'antd';
import CommentSection from './Comments';
import ExtendAuctionModal from './ExtendAuctionModal';
import Caros from './SimilarItemsCarousel'
import Chatbot from './ChatBot';

const { TextArea } = Input;
const { Option } = Select;

const AuctionPage = ({ setLoggedIn }) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [liked, setLiked] = useState(false);
  const [likeNumber, setLikeNumber] = useState(0);
  const [author, setAuthor] = useState("");
  const [authorsRate, setAuthorsRate] = useState(0);
  const role = localStorage.getItem("role");

  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  const [extendModalVisible, setExtendModalVisible] = useState(false);
  const [closeModalVisible, setCloseModalVisible] = useState(false);

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const handleExtendButtonClick = () => {
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
      const response = await axios.put(`http://localhost:4000/api/auctions/${id}/close`);
      console.log(response.data.message);
      setCloseModalVisible(false);
      notification.success({
        message: 'Close Successful',
        description: 'You have successfully closed your auction.',
      });
    } catch (error) {
      console.error("Error closing auction:", error);
      notification.error({
        message: 'Close Failed',
        description: 'Error closing auction.',
      });
    }
  };

  const handlePlaceBid = async () => {
    const amount = bidAmount;
    try {
      const auctionId = item._id;
      const currentUserId = userId;
      const response = await axios.post(
        `http://localhost:4000/api/auctions/${auctionId}/placeBid/${currentUserId}/${amount}`
      );
      notification.success({
        message: 'Success',
        description: 'You have placed your bid.',
      });
    } catch (error) {
      if (amount <= item.highestBid) {
        notification.error({
          message: 'Error',
          description: 'Your bid must be higher than the currently highest bid.',
        });
      }
      if (amount <= item.minimalBid) {
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
      const headers = {
        "Content-Type": "application/json",
      };

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

      if (!response.ok) {
        throw new Error("Failed to add auction to favorites");
      }

      const responseData = await response.json();
      setLiked(true);
      setLikeNumber(likeNumber + 1);
    } catch (error) {
      console.error("Error adding auction to favorites:", error);
    }
  };

  const fetchAuction = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/auctions/${id}`
      );
      setItem(response.data);
      setLikeNumber(response.data.likedBy.length);
      setAuthorsRate(response.data.vendorRating);
    } catch (error) {
      console.error("Error fetching an auction");
    }
  };

  useEffect(() => {
    fetchAuction();
  }, [id]);

  const handleRemoveFromFavorites = async () => {
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
      setLikeNumber(likeNumber - 1);
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
        console.error("Error fetching user");
      }
    };
    if (item) {
      fetchUser();
    }
  }, [item]);

  useEffect(() => {
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
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
  }, [id, userId]);

  const handleReportButtonClick = () => {
    setReportModalVisible(true);
  };

  const handleReportSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/report/report`, {
        reporter: userId,
        auction: id,
        reason: reportReason,
        description: reportDescription,
      });
      notification.success({
        message: 'Report Submitted',
        description: 'Your report has been submitted successfully.',
      });
      setReportModalVisible(false);
    } catch (error) {
      console.error("Error submitting report:", error);
      notification.error({
        message: 'Report Failed',
        description: 'There was an error submitting your report. Please try again.',
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const formatRating = (authorsRate) => {
    if (authorsRate) {
      return authorsRate.toFixed(2);
    } else {
      return "N/A";
    }
  };

  const renderAuctionInfo = () => {
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
          {item && (
            <img
              src={process.env.PUBLIC_URL + item.picture}
              alt="Auction Item"
              style={{ maxWidth: '700px' }}
            />
          )}
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
              <Button className="bid" onClick={handlePlaceBid} disabled={role === "admin" || userId === item.createdBy}>
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
              {liked ? (
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
          <div className="report">
          {(userId && userId !== author._id && role !== 'admin') ? (
              <Button onClick={handleReportButtonClick} className="reportButton">
                <WarningOutlined /> Report Auction
              </Button>
            ) : (
              <Button className="reportButton" disabled>
                <WarningOutlined /> Report Auction
              </Button>
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

  return (
    <div className="auction-container">
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
      <Modal
        title="Report Auction"
        visible={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        onOk={handleReportSubmit}
      >
        <Form layout="vertical">
          <Form.Item label="Reason">
            <Select
              value={reportReason}
              onChange={setReportReason}
              placeholder="Select a reason"
            >
              <Option value="hate_speech">Hate Speech</Option>
              <Option value="spam">Spam</Option>
              <Option value="false_information">False Information</Option>
              <Option value="inappropriate_content">Inappropriate Content</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Description">
            <TextArea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={4}
              placeholder="Describe why you are reporting this auction"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuctionPage;
