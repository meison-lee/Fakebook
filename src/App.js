import { useState, useEffect } from 'react';
import SignIn from './signIn';
import Fakebook from './Fakebook'
// Enable routing between different routes
import { BrowserRouter as Router } from 'react-router-dom';


// local save for account
const LOCALSTORAGE_KEY = 'save-me';
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

// Cookie store in your browser
// If there is a cookie, you can log in directly
const getCookie = (name) => {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    // true if the coolie match
    if (arr != null) {
        return unescape(arr[2]);
    }
    // False there are no match cookie
    // you need to login to setonline to TRUE
    return null;
}

export default () => {
    const [me, setMe] = useState(savedMe || "");
    const [online, setOnline] = useState(getCookie(savedMe) || false);


    useEffect(() => {
        if(online){
            localStorage.setItem(LOCALSTORAGE_KEY, me);
            document.cookie = `${me}=${true}; max-age=3600`
        }
    }, [online, me]);

    return(
        <>
            {online? (
                <Router>
                    <Fakebook me={me} setOnline={setOnline}/>
                </Router>
            ) : (
                <SignIn me={me} setMe={setMe} setOnline={setOnline}/>
            )}
        </>
    );
};