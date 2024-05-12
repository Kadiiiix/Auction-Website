import React from 'react';
import { Empty } from 'antd';
import "./../design/CreateAuction.css"
const NotLoggedIn = () => {
return(
    <>
    <div className='full-container'>
        <Empty description={""} />
        <p>You must be Logged In to see this page.</p>
        <p>Please <a href="http://localhost:3000/login">Log in!</a></p>
    </div>
    </>
);
}
export default NotLoggedIn;