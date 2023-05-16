import { Layout, Modal, Input, Radio, Select, Image } from 'antd';
import styled from 'styled-components';
import Post from './post';
import { useState } from 'react';
import PublicIcon from '@mui/icons-material/Public';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Lock from '@mui/icons-material/Lock';
import { DEFAULT_IMAGE } from './constants';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_POST_MUTATION, DELETE_POST_MUTATION, CREATE_COMMENT_MUTATION, DELETE_COMMENT_MUTATION, LIKE_MUTATION, UNLIKE_MUTATION, UPDATE_POST_MUTATION } from './graphql';
import { v4 as uuidv4 } from 'uuid';
import displayStatus from './displayStatus';
import { IconButton } from '@mui/material';
import { FormOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const MySideer = styled(Sider)`
    flex-basis: 15% !important;
    width: 15% !important;
    max-width: 15% !important;
    min-width: 15% !important;
    background: #031f1c;
;`

const MyContent = styled(Content)`
    overflow: auto;
    .create-post-box {
        width: 100%;
        height: 15%;
        display: flex;
        padding: 24px;
        justify-content: flex-end;
        align-items: center;
    }
    .create-post-button {
        margin: auto;
    }
    .ant-page-header-content {
        padding-top: 0;
    }
    @media screen and (max-height: 220px) {
        .ant-page-header-heading-sub-title {
            display: none;
        }
        .ant-page-header-heading-tags {
            display: none;
        }
        .fall-image {
            width: 100px;
        }
        .time {
            display: none;
        }
    }
`;

const Mask = styled.div`
   position: absolute;
   top: 0%;
   left: 0%;
   z-index: 1001;
   width: 100%;
   height: 100%;
   background-color: #00000073;
`;

const Posts = ({ navigate, POST, me, home, headShotURLs, visit, handleWait }) => {
    const [createPost] = useMutation(CREATE_POST_MUTATION);
    const [deletePost] = useMutation(DELETE_POST_MUTATION);
    const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
    const [deleteComment] = useMutation(DELETE_COMMENT_MUTATION);
    const [editPost] = useMutation(UPDATE_POST_MUTATION); 
    const [like] = useMutation(LIKE_MUTATION);
    const [unlike] = useMutation(UNLIKE_MUTATION);
    const [openCreatePostModal, setOpenCreatePostModal] = useState(false);
    const [openEditPostModal, setOpenEditPostModal] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [published, setPublished] = useState('Public');
    const [tags, setTags] = useState([]);
    const [image, setImage] = useState("");
    const [openMask, setOpenMask] = useState(false);
    const [editPostId, setEditPostId] = useState("");

    const handleCloseCreatePostModal = () => {
        setOpenCreatePostModal(false);
        setOpenEditPostModal(false);
        setPublished('Public')
        setTitle("");
        setBody("");
        setTags([]);
        setImage("");  
    }

    const handleCreatePost = () => {
        if(!title && !body && !image) return;
        createPost({
            variables: {
                author: me,
                postId: uuidv4(),
                title,
                body: body.split(/\n/g),
                tags,
                image,
                published,
            },
            onCompleted: ({ createPost }) => {
                if(createPost){
                    displayStatus({ type: 'success', msg: "Created Successfully!" });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        setOpenCreatePostModal(false);
        setTitle("");
        setBody("");
        setTags([]);
        setImage("");
        setPublished('Public');
        handleWait(0.5);
    };

    const handleDeletePost = (postId) => {
        setOpenMask(false);
        deletePost({
            variables: {
                postId
            },
            onCompleted: ({ deletePost }) => {
                if(deletePost){
                    displayStatus({ type: 'info', msg: "Post Deleted." });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        handleWait(0.5);
    };

    const handleCreateComment = (postId, text) => {
        if(!text.trim()) return;
        createComment({
            variables: {
                postId,
                author: me,
                commentId: uuidv4(),
                text: text.split(/\n/g),
            },
            onCompleted: ({ createComment }) => {
                if(createComment){
                    displayStatus({ type: 'success', msg: "Commemt Sent." });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
    };

    const handleDeleteComment = (postId, commentId) => {
        setOpenMask(false);
        deleteComment({
            variables: {
                postId,
                commentId,
            },
            onCompleted: ({ deleteComment }) => {
                if(deleteComment){
                    displayStatus({ type: 'info', msg: "Comment Deleted!" });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
    };

    const handleLike = (postId) => {
        like({
            variables: {
                postId,
                userName: me,
            },
        });
    };

    const handleUnlike = (postId) => {
        unlike({
            variables: {
                postId,
                userName: me,
            },
        });
    };

    const handleOpenEditPostModal = (postId, published, tags, title, body, image) => {
        setOpenEditPostModal(true);
        setEditPostId(postId);
        setPublished(published);
        setTags(tags);
        setTitle(title);
        setBody(body.join('\n'));
        setImage(image);
    };

    const handleEditPost = () => {
        if(!title && !body && !image) return;
        editPost({
            variables: {
                author: me,
                postId: editPostId,
                title,
                body: body.split(/\n/g),
                tags,
                image,
                published,
            },
            onCompleted: ({ updatePost }) => {
                if(updatePost){
                    displayStatus({ type: 'success', msg: "Edited Successfully!" });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        setOpenEditPostModal(false);
        setTitle("");
        setBody("");
        setTags([]);
        setImage("");
        setPublished('Public');
        handleWait(0.5);
    };

    return(
        <>
        {POST && headShotURLs? (
            <>
                {home?<MySideer />:<></>}
                <MyContent>
                    <Modal title={openCreatePostModal?"Create Post":"Edit Post"} visible={openCreatePostModal || openEditPostModal} onCancel={handleCloseCreatePostModal} onOk={openCreatePostModal?handleCreatePost:handleEditPost}>
                        <Radio.Group onChange={(e) => setPublished(e.target.value)} value={published} style={{ marginBottom: 12 }}>
                            <Radio value='Public'><PublicIcon sx={{ fontSize: 14 }}/></Radio>
                            <Radio value='Friends'><PeopleAltIcon sx={{ fontSize: 14 }}/></Radio>
                            <Radio value='Private'><Lock sx={{ fontSize: 14 }}/></Radio>
                        </Radio.Group>
                        <Select mode="tags" style={{ width: '100%', marginBottom: 12 }} onChange={(value) => setTags(value)} tokenSeparators={[',']} value={tags} placeholder="Tags">
                            <Option key='cool'>cool</Option>
                            <Option key='nice'>nice</Option>
                            <Option key='666'>666</Option>
                            <Option key='覺得新鮮'>覺得新鮮</Option>
                            <Option key='覺得母湯'>覺得母湯</Option>
                        </Select>
                        <Input placeholder="Title" maxLength={100}  value={title} onChange={(e) => setTitle(e.target.value)} style={{ marginBottom: 12 }}/>
                        <TextArea rows={4} maxLength={1000}  value={body} onChange={(e) => setBody(e.target.value)} style={{ marginBottom: 12 }}/>
                        <Input placeholder="Image URL" style={{ marginBottom: 12 }} value={image} onChange={(e) => setImage(e.target.value)} maxLength={400}/>
                        <Image
                            src={image}
                            fallback={DEFAULT_IMAGE}
                        />
                    </Modal>
                    {visit? (
                        <></>
                    ) : (
                        <div className='create-post-box'>
                            {/* <button className='create-post-button' onClick={() => setOpenCreatePostModal(true)}>Create Post</button> */}
                            <IconButton
                                size="large"
                                color="inherit"
                                onClick={() => setOpenCreatePostModal(true)}
                            >
                                <FormOutlined />
                            </IconButton>
                        </div>
                    )}
                    {POST.post.map((post, idx) => {if(idx<20) return <Post post={post} me={me} key={post.postId} handleDeletePost={handleDeletePost} 
                        handleCreateComment={handleCreateComment} handleDeleteComment={handleDeleteComment} handleLike={handleLike} handleUnlike={handleUnlike}
                        setOpenMask={setOpenMask} handleOpenEditPostModal={handleOpenEditPostModal} headShotURLs={headShotURLs} navigate={navigate}/>})}
                </MyContent>
                {home?<MySideer />:<></>}
                <Mask style={{ display: openMask ?'block':'none' }} onClick={() => setOpenMask(false)}/>
            </>
        ) : (
            <></>
        )}
        </>
    );
};

export default Posts;