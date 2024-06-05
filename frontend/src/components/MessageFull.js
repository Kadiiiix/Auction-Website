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
        textAlign: 'center',
      };
      const siderStyle = {
        textAlign: 'center',
        color: '#000',
        backgroundColor: '#fff',
        padding: '10px'
      };
      const layoutStyle = {
        borderRadius: 8,
        overflow: "visible",
        width: 'calc(100% - 8px)',
        maxWidth: 'calc(100% - 8px)',
      };


    return (
        <>
            <Layout style={layoutStyle}>
                <Layout>
                    <Sider width="25%" style={siderStyle}>
                      <MessagesSider/>
                    </Sider>
                    <Content style={contentStyle}>
                        <Messages/>
                    </Content>
                </Layout>
            </Layout>
        </>
    );
};

export default MessageFull;