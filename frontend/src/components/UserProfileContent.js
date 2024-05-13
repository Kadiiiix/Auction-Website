import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "antd";

const UserProfileContent = ({ userId, loggedIn }) => {
  const [author, setAuthor] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [commentsNumber, setCommentsNumber] = useState(0);
  const [favoritesNumber, setFavoritesNumber] = useState(0);
  const [auctionsNumber, setAuctionsNumber] = useState(0);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/comments/${userId}`);
        const comments = response.data;
        const commentsNum = comments.length;
        setCommentsNumber(commentsNum);
      } catch (error) {
        console.error("Error fetching user's comments: ", error)
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const response = await axios.get(`http://localhost:4000/api/users/${userId}`);
        const userData = response.data;

        // Set user data to state variables
        setAuthor(userData.username);
        setName(userData.fullname);
        setPhone(userData.phone_number);
        setEmail(userData.email);
        setCity(userData.city);
        setFavoritesNumber(userData.favorites.length); // Assuming favorites is an array of favorite auction IDs

        if(userData._id === userId)
          setIsCurrentUser(true)
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        // Fetch auctions created by the user
        const response = await axios.get("http://localhost:4000/api/auctions");
        const auctions = response.data;
        const auctionsCreatedByUser = auctions.filter((auction) => auction.createdBy === userId);
        setAuctionsNumber(auctionsCreatedByUser.length);
      } catch (error) {
        console.error("Error fetching auctions: ", error);
      }
    };
    fetchAuctions();
  }, [userId]);

  return (
    <>
    <Card title={`${author}'s Information`} className="main-card">
      <Card type="inner" title="Name" className="card">
        <p>{name}</p>
      </Card>
      <Card type="inner" title="Email" className="card" >
        <p>{email}</p>
      </Card>
      <Card type="inner" title="Phone" className="card">
        <p>{phone}</p>
      </Card>
      <Card type="inner" title="City" className="card">
        <p>{city}</p>
      </Card>
      <Card type="inner" title="Total Comments" className="card">
        <p>{commentsNumber}</p>
      </Card>
      <Card type="inner" title="Total Favorites" className="card">
        <p>{favoritesNumber}</p>
      </Card>
      <Card type="inner" title="Total Auctions Created" className="card">
        <p>{auctionsNumber}</p>
      </Card>
      {isCurrentUser && (
             <div className="edit-button-container">
             <Button type="primary" className="edit-button">
               Edit Your Information
             </Button>
            </div>
          )}
      </Card>
    </>
  );
};

export default UserProfileContent;
