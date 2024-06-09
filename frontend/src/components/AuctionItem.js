import React, {useState, useEffect} from "react";
import { Button, notification, Form, Input, Select, Modal} from 'antd';
import { HeartOutlined, InfoCircleOutlined, HeartFilled } from "@ant-design/icons";
import "../design/AuctionItem.css";
import Timer from "./Timer";
import axios from "axios";

const { TextArea } = Input;
const { Option } = Select;

function AuctionItem({ item, isLoggedIn }) {
  const {
    _id,
    picture,
    name,
    condition,
    category,
    closingDate,
    additionalPhotos,
    startingBid,
    allowInstantPurchase,
    description,
    location,
    age,
    createdBy
  } = item; // Destructure item object

  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const role = localStorage.getItem("role");
  const [liked, setLiked] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");

  const handleAddToFavorites = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `http://localhost:4000/api/favorite/add/${_id}/${userId}`,
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
      setLiked(true);
    } catch (error) {
      console.error("Error adding auction to favorites:", error);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `http://localhost:4000/api/favorite/remove/${_id}/${userId}`,
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
      setLiked(false);
    } catch (error) {
      console.error("Error removing auction from favorites:", error);
    }
  };

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}/favorites`
        );
        const likes = response.data;
        const auctionIdToCheck = _id;
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
  }, [_id, userId]);

  const handleReportButtonClick = () => {
    setReportModalVisible(true);
  };

  const handleReportSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/report/report`, {
        reporter: userId,
        auction: _id,
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



  return (
    <div className = "ContainerAuctionItem">
      <div
        className="ImageAuctionItem"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + item.picture})`,
        }}
      ></div>

      <div className="InfoAndButton">
        <div className="InfoAuctionItem">
          <p className="auction-title" style={{fontSize:"3vh"}}>{name}</p>
          <p>Condition: {condition}</p>
          <p>Closing Date: <Timer closingDate={closingDate}/></p>
          <p>Age: {age}</p>
          <p>Location: {location}</p>
        </div>

        <div className="ButtonAuctionItem">
          <Button>BID NOW</Button>
          {liked ? (
                <>
                    <HeartFilled style={{ color: "grey", fontSize: "25px"}} onClick={handleRemoveFromFavorites}
                    disabled={!isLoggedIn}/>
                </>
              ) : (
                <>
                    <HeartOutlined style={{ color: "grey", fontSize: "25px"}} onClick={handleAddToFavorites} disabled={!isLoggedIn || role==="admin"}/>
                </>
              )}
        </div>
      </div>

      <div className="reporting-dots">
      {(userId && userId !== createdBy._id && role !== 'admin') ? (
                <InfoCircleOutlined style={{ color: "grey"}} onClick={handleReportButtonClick}/>
            ) : (
                <InfoCircleOutlined disabled/>
            )}
      </div>

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
}


export default AuctionItem;
