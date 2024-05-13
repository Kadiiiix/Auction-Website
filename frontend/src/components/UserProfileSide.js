import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Space, Avatar } from "antd";
import { UserOutlined, ShoppingOutlined, HeartOutlined, CommentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import "../design/UserProfile.css";

const UserProfileSide = ({ id, loggedIn }) => {

    const [auctions, setAuctions] = useState([]);
    const [auctionsNumber, setAuctionsNumber] = useState(0);
    const [favoritesNumber, setFavoritesNumber] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [author, setAuthor] = useState("");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${id}/favorites`)
                const favorites = response.data;
                const numberOfFavorites = favorites.length;
                const favoriteAuctions = favorites.data;
                setFavorites(favoriteAuctions);
                setFavoritesNumber(numberOfFavorites);

            } catch (error) {
                console.error("Error fetching auctions: ", error)
            }
        };
        fetchFavorites();
    }, []);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/auctions");
                const auction = response.data;
                const auctionsCreatedByUser = auction.filter(auction => auction.createdBy === id);
                setAuctions(auctionsCreatedByUser);
                const numberOfAuctionsCreatedByUser = auctionsCreatedByUser.length;
                setAuctionsNumber(numberOfAuctionsCreatedByUser);

            } catch (error) {
                console.error("Error fetching auctions: ", error)
            }
        };
        fetchAuctions();
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/comments/${id}`);
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


    const renderSideInfo = () => {
        const sideInfo = [
            { label: `${author}'s Auctions`, url: `/auctions/${id}`, icon: <ShoppingOutlined /> },
            { label: `${author}'s Favorite Auctions`, url: `/favorites/${id}/`, icon: <HeartOutlined /> },
            { label: `${author}'s Comments`, url: `/comments/${id}`, icon: <CommentOutlined /> },
        ];
    
        return (
            <div className="links">
                {sideInfo.map((property, index) => (
                    <Link to={property.url} key={index} className="single-link">
                        <p>{property.icon && property.icon}</p>
                        <p>{property.label}</p>
                    </Link>
                ))}
            </div>
        );
    };
    
    return (
        <>
        <div className="container-side">
        <Space wrap className="item">
            <Avatar shape="square" size={200} icon={<UserOutlined />} />
        </Space>
        <Card
            title={"Search Activity"}
            style={{ width: 300 }}
            className="item"
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                {renderSideInfo()}
            </Space>
        </Card>
        <div className="item">
        {(loggedIn && userId!==id)? <Button className="edit-button">Send Message</Button> : <Button disabled className="edit-button">Send Message</Button>}
        </div>
        </div>
        </>
    );
}

export default UserProfileSide;
