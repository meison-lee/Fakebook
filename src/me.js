import { Layout, Modal, Input, Form, DatePicker, Select, Row, Col, Image } from 'antd';
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
import { useState } from 'react';
import { citys } from './constants';
import moment from "moment";
import { UPDATE_INFO_MUTATION, UPDATE_HEAD_SHOT_MUTATION } from "./graphql";
import { useMutation } from '@apollo/react-hooks';
import displayStatus from './displayStatus';
import { DEFAULT_IMAGE } from './constants';

const { Sider } = Layout;
const { TextArea } = Input

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
        width: 28px;
        height: 28px;
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
    .edit-info-btn {
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

const Me = ({ navigate, me, ME, POST, headShotURLs, handleWait }) => {
    const [editInfo] = useMutation(UPDATE_INFO_MUTATION);
    const [updateHeadShot] = useMutation(UPDATE_HEAD_SHOT_MUTATION);
    const [openEditInfoModal, setOpenEditInfoModal] = useState(false);
    const [school, setSchool] = useState("");
    const [from, setFrom] = useState("");
    const [liveIn, setLiveIn] = useState("");
    const [birthday, setBirthday] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [github, setGithub] = useState("");
    const [instagram, setInstagram] = useState("");
    const [website, setWebsite] = useState("");
    const [position, setPosition] = useState("");
    const [company, setCompany] = useState("");
    const [about, setAbout] = useState("");
    const [openEditHeadShotModal, setEditHeadShotModal] = useState(false);
    const [uploadImage, setUploadImage] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [baseImage, setBaseImage] = useState("");

    const handleCloseEditInfoModal = () =>{
        setOpenEditInfoModal(false);
        setSchool("");
        setFrom("");
        setLiveIn("")
        setBirthday("");
        setPhone("");
        setEmail("");
        setGithub("");
        setInstagram("");
        setWebsite("");
        setPosition("");
        setCompany("");
        setAbout("");
    };

    const handleOpenEditInfoModal = () => {
        const { school, from, liveIn, birthday, phone, email, github, instagram, website, position, company, about } = ME.me;
        setOpenEditInfoModal(true);
        setSchool(school);
        setFrom(from);
        setLiveIn(liveIn);
        setBirthday(birthday);
        setPhone(phone);
        setEmail(email);
        setGithub(github);
        setInstagram(instagram);
        setWebsite(website);
        setPosition(position);
        setCompany(company);
        setAbout(about);
    };

    const handleEditInfo = () => {
        editInfo({
            variables: {
                userName: me,
                birthday: birthday,
                from: from,
                liveIn: liveIn,
                school: school,
                email: email,
                phone: phone,
                instagram: instagram,
                website: website,
                about: about,
                github: github,
                position: position,
                company: company
            },
            onCompleted: ({ updateInfo }) => {
                if(updateInfo){
                    displayStatus({ type: 'success', msg: "Edited successfully!" });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        setOpenEditInfoModal(false);
        setSchool("");
        setFrom("");
        setLiveIn("")
        setBirthday("");
        setPhone("");
        setEmail("");
        setGithub("");
        setInstagram("");
        setWebsite("");
        setPosition("");
        setCompany("");
        setAbout("");
        handleWait(1);
    };

    const handleUploadImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const img = e.target.files[0];
            console.log(img);
            const size = img.size;
            const type = img.type;
            if(type!=='image/gif' && type!=='image/png' && type!=='image/jpeg'){
                alert("檔案格式錯誤");
                e.target.value = ''
                setBaseImage("");
                setUploadImage("");
                return;                
            }
            if (size>2101440) {
                // 圖片大於2MB
                alert("圖片過大");
                e.target.value = '';
                setBaseImage("");
                setUploadImage("");
                return;
            };
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = (e) => {
                const base64 = e.target.result.substring(13+type.length);
                setBaseImage(base64);
                setUploadImage(URL.createObjectURL(img));
            };
        };
    };

    const handleUpdateHeadShotByURL = () => {
        updateHeadShot({
            variables: {
                userName: me,
                headShotURL: imageURL,
                updateType: 'URL'
            },
            onCompleted: ({ updateHeadShot }) => {
                if(updateHeadShot){
                    displayStatus({ type: 'success', msg: "Updated Successfully!" });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        setEditHeadShotModal(false);
        setImageURL("");
        handleWait(2);
    };

    const handleCloseEditHeadShotModal = () => {
        setEditHeadShotModal(false);
        setImageURL("");
        setUploadImage("");
        setBaseImage("");
    };

    const handleUpdateHeadShotByIMGUR = () => {
        if(!baseImage) return;
        const xhttp = new XMLHttpRequest();
        xhttp.open('POST', 'https://api.imgur.com/3/image', true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.setRequestHeader("Authorization", "Client-ID b50a7351eee91f0");
        xhttp.send(JSON.stringify({ 'image': baseImage }));
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                const response = JSON.parse(xhttp.responseText)
                console.log(response);
                updateHeadShot({
                    variables: {
                        userName: me,
                        headShotURL: response.data.link,
                        updateType: 'IMGUR'
                    },
                    onCompleted: ({ updateHeadShot }) => {
                        if(updateHeadShot){
                            displayStatus({ type: 'success', msg: "Uploaded Successfully!" });
                        }else{
                            displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                        };
                    },
                });
            }
        };
        setEditHeadShotModal(false);
        setUploadImage("");
        setBaseImage("");
        handleWait(5);
    };


    return (
        <>
            <MySideer>
                <div className='head-shot-box'>
                    <Avatar className='head-shot' src={headShotURLs[me]} onClick={() => setEditHeadShotModal(true)} sx={{ cursor: 'pointer' }}/>
                </div>  
                <div className='info-box'>
                    <div className='flex-row-header'>
                        <Typography sx={{ fontSize: '2rem', fontWeight: 'bolder' }} noWrap>{me}</Typography>
                        <button className='edit-info-btn' onClick={handleOpenEditInfoModal}>Edit Info</button>
                    </div>
                    {!ME.me.about && !ME.me.position && !ME.me.school && !ME.me.from && !ME.me.liveIn && !ME.me.birthday && !ME.me.phone && !ME.me.email && !ME.me.github && !ME.me.instagram && !ME.me.website? (
                        <Typography sx={{ fontSize: '1.5rem', overflowWrap: 'break-word', color: 'gray' }}>I'm a lazybones...</Typography>
                    ) : (
                        <></>
                    )}
                    {ME.me.about?<Typography sx={{ fontSize: '1.5rem', overflowWrap: 'break-word', marginBottom: '6px' }} className='about'>{ME.me.about}</Typography>:<></>}
                    {ME.me.position? (
                        <div className='flex-row'><img className='image' src={portfolioIcon}/>
                            <Typography sx={{ fontSize: '1.2rem' }} noWrap>{`${ME.me.position} at ${ME.me.company}`}</Typography>
                        </div>
                    ) : (
                        <></>
                    )}
                    {ME.me.school? (
                        <div className='flex-row'><img className='image' src={schoolIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{ME.me.school}</Typography></div>
                    ) : (
                        <></>
                    )}
                    {ME.me.from? (
                        <div className='flex-row'><img className='image' src={homeIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{`From ${ME.me.from}`}</Typography></div>
                    ) : (
                        <></>
                    )}
                    {ME.me.liveIn? (
                        <div className='flex-row'><img className='image' src={liveInIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{`Now in ${ME.me.liveIn}`}</Typography></div>
                    ): (
                        <></>
                    )}
                    {ME.me.birthday? (
                        <div className='flex-row'><img className='image' src={birthdayIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{ME.me.birthday}</Typography></div>
                    ) : (
                        <></>
                    )}
                    {ME.me.phone? (
                        <div className='flex-row'><img className='image' src={phoneIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{ME.me.phone}</Typography></div>
                    ) : (
                        <></>
                    )}
                    {ME.me.email? (
                        <div className='flex-row'><img className='image' src={mailIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap>{ME.me.email}</Typography></div>
                    ) : (
                        <></>
                    )}
                    {ME.me.github? (
                        <div className='flex-row'><img className='image' src={githubIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap><a href={ME.me.github} target='_blank'>{ME.me.github}</a></Typography></div>
                    ) : (
                        <></>
                    )}
                    {ME.me.instagram? (
                        <div className='flex-row'><img className='image' src={instagramIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap><a href={ME.me.instagram} target='_blank'>{ME.me.instagram}</a></Typography></div>
                    ) : (
                        <></>
                    )}
                    {ME.me.website? (
                        <div className='flex-row'><img className='image' src={websiteIcon}/><Typography sx={{ fontSize: '1.2rem' }} noWrap><a href={ME.me.website} target='_blank'>{ME.me.website}</a></Typography></div>
                    ) : (
                        <></>
                    )}

                </div>
                <Modal title="Edit Info" visible={openEditInfoModal} onOk={handleEditInfo} onCancel={handleCloseEditInfoModal}>
                    <Form
                    >
                        <Form.Item label="School">
                            <Input placeholder='NTU' value={school} onChange={(e) => setSchool(e.target.value)} maxLength={50}/>
                        </Form.Item>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item label="From">
                                        <Select value={from} onChange={(value) => setFrom(value)}>
                                            <Select.Option key="" value="">{""}</Select.Option>
                                            {citys.map((city) => <Select.Option key={city} value={city}>{city}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="In">
                                        <Select value={liveIn} onChange={(value) => setLiveIn(value)}>
                                            <Select.Option key="" value="">{""}</Select.Option>
                                            {citys.map((city) => <Select.Option key={city} value={city}>{city}</Select.Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                <Form.Item label="Birthday">
                                    <DatePicker value={birthday?moment(birthday):""} onChange={(date, dateString) => setBirthday(dateString)}/>
                                </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Mobile">
                                        <Input placeholder="0123456789" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Email">
                                        <Input placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={50}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Github">
                                        <Input placeholder="https://github.com/example"  value={github} onChange={(e) => setGithub(e.target.value)} maxLength={100}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Instagram">
                                        <Input placeholder="https://www.instagram.com/example" value={instagram} onChange={(e) => setInstagram(e.target.value)} maxLength={100}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Website">
                                        <Input placeholder="https://example" value={website} onChange={(e) => setWebsite(e.target.value)} maxLength={150}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item 
                                        label="Company"
                                        required={company || position?true:false}
                                    >
                                        <Input placeholder="Google" value={company} onChange={(e) => setCompany(e.target.value)} maxLength={50}/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item 
                                        label="Position"
                                        required={company || position?true:false}
                                    >
                                        <Input placeholder="Engineer" value={position} onChange={(e) => setPosition(e.target.value)} maxLength={50}/>
                                    </Form.Item> 
                                </Col>
                            </Row>
                        <Form.Item 
                            label="About"
                        >
                            <TextArea rows={4} value={about} onChange={(e) => setAbout(e.target.value)} maxLength={200}/>
                        </Form.Item> 
                    </Form>
                </Modal>
                <Modal title="Update profile picture" visible={openEditHeadShotModal} onCancel={handleCloseEditHeadShotModal} onOk={handleUpdateHeadShotByIMGUR}>
                    <>
                        <Image src={uploadImage} fallback={DEFAULT_IMAGE}/>
                        <input type="file" onChange={handleUploadImage}></input>
                        {/* <Input placeholder="Image URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} maxLength={400}/> */}
                    </>
                </Modal>
            </MySideer>
            <Posts navigate={navigate} me={me} POST={POST} home={false} headShotURLs={headShotURLs} visit={false} handleWait={handleWait}/>
        </>
    )
};

export default Me;