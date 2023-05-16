import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PageHeader, Button, Tag, Typography as T, Collapse, Form, Input, Image, Popconfirm } from 'antd';
import { Avatar, Typography, IconButton, Tooltip } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Lock from '@mui/icons-material/Lock';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import moment from "moment";
import { DEFAULT_IMAGE } from './constants';

const { Paragraph } = T;
const { Panel } = Collapse;
const { TextArea } = Input;

const MyContent = styled.div`
    display: flex; 
    flex-direction: column;
    .post-body {
        flex: 1;
    }
    .post-image {
        width: 500px;
        height: 333px;
    }
    .post-comment {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
        border-bottom: 1px solid #0000001a;      
    }
    .text {
        margin-left: 20px;
        margin-right: 20px;
        color: black;
        background-color: #f0f2f5;
        padding: 16px;
        border-radius: 10px;
        position: relative;
        max-width: 300px;
        overflow-wrap: break-word;
    }
    .time {
        margin-left: 20px;
        color: rgba(0, 0, 0, 0.5);
    }
    .post-comment-avatar {
        text-align: center;
        font-size: 15px;
        width: 60px;
    }
    .delete-message {
        margin-left: auto;
    }
    .fall-image {
        width: 200px
    }
    @media screen and (max-height: 350px) {
        .text {
            max-width: 150px;
        }
    }
    @media screen and (max-height: 210px) {
        .text {
            max-width: 75px;
            margin-right: 10px;
        }
    }
    @media screen and (max-height: 180px) {
        .text {
            max-width: 50px;
        }
        .delete-message {
            display: none;
        }
    }
`;

const Content = ({ text, setText, post, me, handleCreateComment, handleDeleteComment, handleLike, handleUnlike, setOpenMask, headShotURLs, navigate }) => (
    <MyContent>
        <div>
            <Typography sx={{ fontSize: 'large', fontWeight: 'bolder' }}>{post.title}</Typography>
        </div>
        <div className='post-body'>
            {post.body.map((body, idx) => {
                if(body==="") return <br key={idx}/>
                else return <Paragraph key={idx} style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>{body}</Paragraph>
            })}
        </div>
        {post.image===""?<></>:<Image src={post.image} fallback={DEFAULT_IMAGE} onError={(e) => {e.target.classList.add('fall-image')}}/>}
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
                size="small"
                color="inherit"
                className='like'
                onClick={post.likes.some(like => like===me)?() => handleUnlike(post.postId):() => handleLike(post.postId)}                   
            >
                {post.likes.some(like => like===me)?<FavoriteIcon sx={{ color: '#ef5454' }}/>:<FavoriteBorderIcon />}
            </IconButton>
            <p style={{ fontWeight: 'bolder', marginBottom: 0 }}>{`${post.likes.length} ${post.likes.length>1?'likes':'like'}`}</p>
        </div>
        <Collapse>
            <Panel header={`${post.comments.length} ${post.comments.length>1?"Comments":"Comment"}`} style={{ fontWeight: 'bolder' }}>
                {post.comments.map(comment => (
                    <div className='post-comment' key={comment.commentId}>
                        <div className='post-comment-avatar'>
                            <Avatar sx={{ margin: 'auto', cursor: 'pointer' }} src={headShotURLs[comment.author]} onClick={comment.author===me? () => navigate('/me'):() => navigate(`/visits/${comment.author}`)}/> 
                            <Typography variant="inherit" noWrap>{comment.author}</Typography>
                        </div>
                        <div>
                            <div className='text'>
                                {comment.text.map((text, idx) => {
                                    if(text==="") return (<br key={idx} />)
                                    else return (<p key={idx} style={{ marginBottom: 0 }}>{text}</p>)
                                })}
                            </div>
                            <div className='time'>{moment(comment.timestamp).fromNow()}</div>
                        </div>
                        {comment.author===me? (
                            <>
                                <Popconfirm placement="topRight" title="Delete this comment？" onConfirm={() => handleDeleteComment(post.postId, comment.commentId)} 
                                okText="Yes" cancelText="No" onCancel={() => setOpenMask(false)}>
                                    <IconButton
                                        size="small"
                                        color="inherit"
                                        className='delete-message'
                                        onClick={() => setOpenMask(true)}                                    
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Popconfirm>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                ))}
                <TextArea rows={4} onChange={(e) => setText(e.target.value)} value={text} style={{ marginBottom: 12 }} maxLength={300}/>
                <div style={{ display: 'flex' }}>
                    <Button type="primary" onClick={() => {handleCreateComment(post.postId, text);setText("")}} style={{ marginLeft: 'auto' }}>Add Comment</Button>
                </div>
            </Panel>
        </Collapse>
    </MyContent>
);

const Title = ({ post: { author }, headShotURLs, navigate, me }) => (
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'default' }}>
            <Avatar sx={{ width: 36, height: 36, mr: '6px', cursor: 'pointer' }} src={headShotURLs[author]} onClick={author===me? () => navigate('/me'):() => navigate(`/visits/${author}`)}/>
            <Typography variant="inherit" sx={{ fontSize: 18, maxWidth: 150 }} noWrap>{author}</Typography>
    </div>
);

const SubTitle = ({ post: { createTime, published }}) => (
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'default' }}>
        <span className="ant-page-header-heading-sub-title" style={{ fontSize: 14 }}>{formatDate(new Date(createTime))}</span>
        {published==='Public'?
            <Tooltip title="Public" placement="top"><PublicIcon sx={{ width: 14, height: 14 }}/></Tooltip>:
            published==='Friends'?
                <Tooltip title="Friends" placement="top"><PeopleAltIcon sx={{ width: 14, height: 14 }}/></Tooltip>:
                <Tooltip title="Private" placement="top"><Lock sx={{ width: 14, height: 14 }}/></Tooltip>}
    </div> 
);

const formatDate = (d) => {
    let year = d.getFullYear();
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    let hour = '' + d.getHours();
    let minute = '' + d.getMinutes();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    return [year, month, day, hour].join('-') + ':' + minute;
}

const Post = ({ post, me, handleDeletePost, handleCreateComment, handleDeleteComment, handleLike, handleUnlike, setOpenMask, handleOpenEditPostModal, headShotURLs, navigate }) => {
    const [text, setText] = useState("");

    return (
        <>
            <PageHeader
                className="site-page-header"
                title={<Title post={post} headShotURLs={headShotURLs} navigate={navigate} me={me}/>}
                subTitle={<SubTitle post={post}/>}
                tags={post.tags.map((tag, idx) => <Tag color='blue' style={{ cursor: 'pointer' }} key={idx}>{tag}</Tag>)}
                extra={post.author===me? [
                    <Button key="0" type="primary" ghost onClick={() => handleOpenEditPostModal(post.postId ,post.published, post.tags, post.title, post.body, post.image)}>Edit</Button>, 
                    <Popconfirm key="1" placement="topRight" title="Delete this post？" onConfirm={() => handleDeletePost(post.postId)} okText="Yes" cancelText="No" onCancel={() => setOpenMask(false)}>
                        <Button type="primary" danger ghost onClick={() => setOpenMask(true)}>Delete</Button>
                    </Popconfirm>
                ]:[]}
            >
                <Content
                    text={text}
                    setText={setText}
                    post={post}
                    me={me}
                    handleCreateComment={handleCreateComment}
                    handleDeleteComment={handleDeleteComment}
                    handleLike={handleLike}
                    handleUnlike={handleUnlike}
                    setOpenMask={setOpenMask}
                    headShotURLs={headShotURLs}
                    navigate={navigate}
                />
            </PageHeader>
        </>
    );
};

export default Post;

