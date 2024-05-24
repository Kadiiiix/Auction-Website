import React from 'react';
import { Empty } from 'antd';
import "./../design/CreateAuction.css"
const NotLoggedIn = () => {
return(
    <>
    <div className='full-container'>
        <Empty description={""} />
        <p>Your access to this page is denied. You must be logged in.</p>
        <p>Please <a href="http://localhost:3000/login">Log in!</a></p>
    </div>
    </>
);
}
export default NotLoggedIn;