import React, { useEffect, useState } from "react";
import { Flex, Layout, Avatar, Space, Button  } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UserProfileContent from "./UserProfileContent";
import "../design/UserProfile.css"
import axios from "axios";

const UserProfile = ({userId, loggedIn}) => {

    console.log(userId)
    const [auctions, setAuctions] = useState([]);
    const [auctionsNumber, setAuctionsNumber] = useState(0);
    const [favoritesNumber, setFavoritesNumber] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [commentsNumber, setCommentsNumber] = useState(0);
    const [author, setAuthor] = useState("");

    const { Sider, Content } = Layout;

      const contentStyle = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
        color: '#fff',
      };
      const siderStyle = {
        textAlign: 'center',
        lineHeight: '120px',
        color: '#000',
        backgroundColor: '#fff',
        padding: '10px'
      };
      const layoutStyle = {
        borderRadius: 8,
        overflow: 'hidden',
        width: 'calc(100% - 8px)',
        maxWidth: 'calc(100% - 8px)',
      };

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
          { label: `${author}'s Auctions`, value: auctionsNumber},
          { label: `${author}'s Favorite Auctions`, value: favoritesNumber},
          { label: `${author}'s Comments`, value: commentsNumber},
        ];

        return (
          <div className="links">
            {sideInfo.map((property, index) => (
              <p key={index} className="single-link">
                {property.label} ({property.value})
              </p>
            ))}
          </div>
        )
      }


    return (
        <>
            <Layout style={layoutStyle}>
                <Layout>
                    <Sider width="25%" style={siderStyle}>
                    <Space wrap>
                        <Avatar shape="square" size={200} icon={<UserOutlined />} />
                    </Space>
                      {renderSideInfo()}
                      {loggedIn ? (
                        <><Button>Send Message to {author}</Button></>
                      ) : (
                        <><Button>Log In to message {author}!</Button></>
                      )}
                    </Sider>
                    <Content style={contentStyle}>
                      <UserProfileContent userId={userId} loggedIn={loggedIn}/>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default UserProfile;