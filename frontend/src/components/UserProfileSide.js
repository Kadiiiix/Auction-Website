import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Space, Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import "../design/UserProfile.css";

const UserProfileSide = ({ userId, loggedIn }) => {

    const [auctions, setAuctions] = useState([]);
    const [auctionsNumber, setAuctionsNumber] = useState(0);
    const [favoritesNumber, setFavoritesNumber] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [author, setAuthor] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${userId}/favorites`)
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
        const userId = localStorage.getItem("userId");

        const fetchAuctions = async () => {
            try {
                const response = await axios.get("http://localhost:4000/api/auctions");
                const auction = response.data;
                const auctionsCreatedByUser = auction.filter(auction => auction.createdBy === userId);
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
        const userId = localStorage.getItem("userId");

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
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:4000/api/users/${userId}`
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
            { label: `${author}'s Auctions`},
            { label: `${author}'s Favorite Auctions` },
            { label: `${author}'s Comments`},
        ];

        return (
            <div className="links">
                {sideInfo.map((property, index) => (
                    <p key={index} className="single-link">
                        {property.label}
                    </p>
                ))}
            </div>
        )
    }

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
        {loggedIn ? <Button className="edit-button">Send Message</Button> : <Button disabled className="edit-button">Log In to Message</Button>}
        </div>
        </div>
        </>
    );
}

export default UserProfileSide;
