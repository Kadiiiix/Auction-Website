import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Space, Avatar, notification } from "antd";
import { UserOutlined, ShoppingOutlined, HeartOutlined, CommentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import "../design/UserProfile.css";
import Rating from "./Rating";

const UserProfileSide = ({ id, loggedIn }) => {
    const [auctions, setAuctions] = useState([]);
    const [auctionsNumber, setAuctionsNumber] = useState(0);
    const [favoritesNumber, setFavoritesNumber] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [author, setAuthor] = useState("");
    const [photo, setPhoto] = useState(""); // State for user's photo
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [showUpload, setShowUpload] = useState(false); // State to manage visibility of upload input
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${id}/favorites`);
                const favorites = response.data;
                const numberOfFavorites = favorites.length;
                const favoriteAuctions = favorites.data;
                setFavorites(favoriteAuctions);
                setFavoritesNumber(numberOfFavorites);
            } catch (error) {
                console.error("Error fetching auctions: ", error);
            }
        };
        fetchFavorites();
    }, [id]);

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
                console.error("Error fetching auctions: ", error);
            }
        };
        fetchAuctions();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/comments/${id}`);
                const comments = response.data;
                const commentsNum = comments.length;
                setCommentsNumber(commentsNum);
            } catch (error) {
                console.error("Error fetching user's comments: ", error);
            }
        };
        fetchComments();
    }, [id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/users/${id}`);
                const user = response.data;
                setAuthor(user.username);
                setPhoto(user.photo); // Set the user's photo
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUser();
    }, [id]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const response = await axios.post('http://localhost:4000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.imageUrl);
            setUploading(false);
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploading(false);
        }
    };

    const handleImageUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/api/users/${id}/image`, { imageUrl });
            if (response.data) {
                notification.success({
                    message: 'Success',
                    description: 'Image updated successfully.',
                });
                setPhoto(imageUrl); // Update the photo state
                setShowUpload(false); // Hide the upload input after updating
            }
        } catch (error) {
            console.error('Error updating image:', error);
            notification.error({
                message: 'Error',
                description: 'There was an error updating the image.',
            });
        }
    };

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
                    <Avatar shape="square" size={200} src={photo} icon={<UserOutlined />} />
                </Space>
                    {loggedIn && userId === id && (
                        <>
                            {!showUpload && (
                                <Button onClick={() => setShowUpload(true)} style={{ marginTop: 10 }}>
                                    Update Image
                                </Button>
                            )}
                            {showUpload && (
                                <>
                                    <input type="file" onChange={handleImageUpload} style={{ marginTop: 10 }} />
                                    <Button onClick={handleImageUpdate} disabled={uploading || !imageUrl}>
                                        {uploading ? 'Uploading Image...' : 'Save Image'}
                                    </Button>
                                </>
                            )}
                        </>
                    )}

                <Card title={`${author}'s Rating`} style={{ width: 300 }}>
                    <Rating id={id} userId={userId} />
                </Card>
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
                    {(loggedIn && userId !== id) ? <Button className="edit-button"><Link to={`http://localhost:3000/messages/${id}`}>Send Message</Link></Button> : <Button disabled className="edit-button">Send Message</Button>}
                </div>
            </div>
        </>
    );
};

export default UserProfileSide;
