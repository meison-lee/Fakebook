import { useState, useEffect } from 'react';
import SignIn from './signIn';
import Fakebook from './Fakebook';
import { BrowserRouter as Router } from 'react-router-dom';

const LOCALSTORAGE_KEY = 'save-me';
const savedMe = localStorage.getItem(LOCALSTORAGE_KEY);

const getCookie = (name) => {
    let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
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