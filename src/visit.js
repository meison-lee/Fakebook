import { Layout, Modal, Input, Spin } from 'antd';
import styled from 'styled-components';
import Posts from './posts'
import { Avatar, Typography } from '@mui/material';
import birthdayIcon from "./img/birthday-cake.png";
import mailIcon from './img/at.png';
import liveInIcon from './img/live-in.png';
import githubIcon from './img/github.png';
import schoolIcon from './img/graduation-hat.png';
import homeIcon from './img/home.png';
import instagramIcon from "./img/instagram.png";
import phoneIcon from "./img/telephone.png";
import portfolioIcon from "./img/portfolio.png";
import websiteIcon from "./img/global.png";
import { useState, useEffect } from 'react';
import { GET_VISIT_QUERY } from "./graphql";
import { useQuery } from '@apollo/react-hooks';
import displayStatus from './displayStatus';
import { useParams } from 'react-router-dom'
import Me from './me';

const { Sider } = Layout;

const MySideer = styled(Sider)`
    flex-basis: 30% !important;
    width: 30% !important;
    max-width: 30% !important;
    min-width: 30% !important;
    background: white;
    padding: 24px;
    overflow: auto;
    .head-shot-box {
        display: flex;
        justify-content: center;
        height: 30%;
        margin-bottom: 12px;
    }
    .head-shot {
        width: 200px;
        height: 200px;
    }
    .info-box {
        height: 70%;
        width: 100%;
        padding: 24px;
        padding-top: 0px;
    }
    .image {
        width: 32px;
        height: 32px;
        margin-right: 6px;
    }
    .flex-row {
        display: flex;
        margin-bottom: 6px;
    }
    .flex-row-header {
        display: flex;
        margin-bottom: 6px;
    }
    .friend-btn {
        margin-left: auto;
        margin-top: auto;
        margin-bottom: auto;
    }
    @media screen and (max-height: 700px) {
        .head-shot-box {
            height: 35%;
        }
    }
    @media screen and (max-height: 600px) {
        .head-shot-box {
            height: 40%;
            margin-bottom: 24px !important;
        }
        .friend-btn {
            display: none;
        }
    }
    @media screen and (max-height: 480px) {
        .head-shot {
            width: 170px;
            height: 170px;
        }
    }
    @media screen and (max-height: 430px) {
        .head-shot-box {
            height: 45%;
        }
        .head-shot {
            width: 150px;
            height: 150px;
        }
    }
    @media screen and (max-height: 350px) {
        .head-shot {
            width: 120px;
            height: 120px;
        }
        .edit-info-btn {
            display: none;
        }
        .about {
            display: none;
        }
    }
    @media screen and (max-height: 300px) {
        .head-shot {
            width: 100px;
            height: 100px;
        }
        .flex-row {
            display: none;
        }
        .flex-row-header {
            display: none;
        }
    }
    @media screen and (max-height: 200px) {
        .head-shot {
            width: 75px;
            height: 75px;
        }
    }
;`

const LoadBox = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Visit = ({ navigate, me, ME, POST, headShotURLs, acceptRequest, addFriend }) => {
    const { visit } = useParams();
    const [currentVisit, setCurrentVisit] = useState(visit);
    const { data: VISIT, loading, refetch } = useQuery(GET_VISIT_QUERY, {
         variables: { query: visit },
         onCompleted: () => {
             setCurrentVisit(visit);
         }
    });

    useEffect(() => {
        refetch();
    }, [currentVisit])
    
    return (
        <> 
            {loading? (
                <LoadBox>
                    <Spin size="large" tip="Loading..."/>
                </LoadBox>
            ) : (
                <>
                    <MySideer>
                        <div className='head-shot-box'>
                            <Avatar className='head-shot' src={headShotURLs[visit]}/>
                        </div>  
                        <div className='info-box'>
                            <div className='flex-row-header'>
                                <Typography sx={{ fontSize: '2rem', fontWeight: 'bolder' }} noWrap>{visit}</Typography>
                                {ME.me.friends.some(friend => friend===visit)?<button className='friend-btn' disabled>Friend</button>:ME.me.requests.some(request => request===visit)?<button className='friend-btn' disabled>Wait For Confirmation</button>:
                                ME.me.invitations.some(invitation => invitation===visit)?<button className='friend-btn' onClick={() => acceptRequest({ variables: { from: me, to: visit } })} style={{ cursor: 'pointer' }}>Comfirm Request</button>:
                                <button className='friend-btn' onClick={() => addFriend({ variables: { from: me, to: visit } })} style={{ cursor: 'pointer' }}>Add Friend</button>}
                            </div>
                            {!VISIT.visit.about && !VISIT.visit.position && !VISIT.visit.school && !VISIT.visit.from && !VISIT.visit.liveIn && !VISIT.visit.birthday && !VISIT.visit.phone && !VISIT.visit.email && !VISIT.visit.github && !VISIT.visit.instagram && !VISIT.visit.website? (
                                <Typography sx={{ fontSize: '1.5rem', overflowWrap: 'break-word', color: 'gray' }}>I'm a lazybones...</Typography>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.about?<Typography sx={{ fontSize: '1.5rem', overflowWrap: 'break-word', marginBottom: '6px' }} className='about'>{VISIT.visit.about}</Typography>:<></>}
                            {VISIT.visit.position? (
                                <div className='flex-row'><img className='image' src={portfolioIcon}/>
                                    <Typography sx={{ fontSize: '1.2rem' }} noWrap>{`${VISIT.visit.position} at ${VISIT.visit.company}`}</Typography>
                                </div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.school? (
                                <div className='flex-row'><img className='image' src={schoolIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{VISIT.visit.school}</Typography></div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.from? (
                                <div className='flex-row'><img className='image' src={homeIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{`From ${VISIT.visit.from}`}</Typography></div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.liveIn? (
                                <div className='flex-row'><img className='image' src={liveInIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{`Now in ${VISIT.visit.liveIn}`}</Typography></div>
                            ): (
                                <></>
                            )}
                            {VISIT.visit.birthday? (
                                <div className='flex-row'><img className='image' src={birthdayIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{VISIT.visit.birthday}</Typography></div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.phone? (
                                <div className='flex-row'><img className='image' src={phoneIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{VISIT.visit.phone}</Typography></div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.email? (
                                <div className='flex-row'><img className='image' src={mailIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{VISIT.visit.email}</Typography></div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.github? (
                                <div className='flex-row'><img className='image' src={githubIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap><a href={VISIT.visit.github} target='_blank'>{VISIT.visit.github}</a></Typography></div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.instagram? (
                                <div className='flex-row'><img className='image' src={instagramIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap><a href={VISIT.visit.instagram} target='_blank'>{VISIT.visit.instagram}</a></Typography></div>
                            ) : (
                                <></>
                            )}
                            {VISIT.visit.website? (
                                <div className='flex-row'><img className='image' src={websiteIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap><a href={VISIT.visit.website} target='_blank'>{VISIT.visit.website}</a></Typography></div>
                            ) : (
                                <></>
                            )}

                        </div>
                    </MySideer>
                    <Posts navigate={navigate} me={me} POST={{ post: POST.post.filter(post => post.author===visit)}} home={false} headShotURLs={headShotURLs} visit={true}/>
                </>
            )}
        </>
    )
};

export default Visit;