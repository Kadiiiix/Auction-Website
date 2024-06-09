import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from 'antd';
import Messages from "./Messages";
import MessagesSider from "./MessagesSider";

const MessageFull = ({loggedIn}) => {

    const { id } = useParams();
    const userId = localStorage.getItem("userId");

    const { Sider, Content } = Layout;

      const contentStyle = {
        textAlign: "center",
      };
      const siderStyle = {
        textAlign: 'center',
        color: '#000',
        backgroundColor: '#fff',
        padding: '10px'
      };
      const layoutStyle = {
        borderRadius: 8,
        height:"auto",
      };


    return (
      <>
        <Layout height="50%" style={layoutStyle}>
            <Sider width="25%" style={siderStyle}>
              <MessagesSider height="75%" />
            </Sider>
            <Content height="75%" style={contentStyle}>
              <Messages />
            </Content>
        </Layout>
      </>
    );
};

export default MessageFull;