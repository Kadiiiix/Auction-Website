import React from "react";
import { useParams } from "react-router-dom";
import { Layout } from 'antd';
import Messages from "./Messages";
import MessagesSider from "./MessagesSider";


const MessageFull = ({loggedIn}) => {

    const { id } = useParams();
    const userId = localStorage.getItem("userId");


    console.log("userid",userId);
    console.log("id", id);

    const { Sider, Content } = Layout;

      const contentStyle = {
        textAlign: 'center',
        //minHeight: 120,
        //lineHeight: '120px',
        //color: '#fff',
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