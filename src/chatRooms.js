import { 
    CREATE_ROOM_MUTATION,
    SEND_MESSAGE_MUTATION,
    LEAVE_ROOM_MUTATION,
    UPDATE_MESSAGES_VIEW_TIME_MUTATION,
    DELETE_MESSAGE_MUTATION,
    ADD_ROOM_MEMBER_MUTATION,
} from './graphql';
import { useMutation } from '@apollo/react-hooks';
import { useState, useEffect, useRef } from 'react';
import displayStatus from './displayStatus';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import { IconButton, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Layout, Button, Select, Input, message, Popconfirm } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import moment from "moment";

const { Sider, Content } = Layout;
const { Option } = Select;

const RoomListWrapper = styled(Sider)`
    flex-basis: 25% !important;
    width: 25% !important;
    max-width: 25% !important;
    min-width: 25% !important;
    border-right: 1px solid #0000001a;
    background: white;
    .room-list-header {
        height: 10%;
        text-align: center;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #0000001a;
    }
    .room-list-content {
        height: 90%;
        overflow: auto;
    }
    @media screen and (max-height: 480px) {
        .room-list-header {
            height: 20%;
        }
        .room-list-content {
            height: 80%;
        }
    }
    @media screen and (max-height: 350px) {
        .room-list-header {
            height: 30%;
        }
        .room-list-content {
            height: 70%;
        }
    }
    @media screen and (max-height: 290px) {
        .add-room-btn {
            display: none;
        }
    }
    @media screen and (max-height: 200px) {
        .room-list-header {
            height: 40%;
        }
        .room-list-content {
            height: 60%;
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

const CreateRoomModal = styled.div`
    position: absolute;
    z-index: 1002;
    width: 455px;
    height: 300px;
    background-color: white;
    left: calc((100vw - 455px)/2);
    top: calc((100vh - 300px)/2);
    .add-room-title {
        font-weight: 500;
        font-size: 16px;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
    }
    .add-room-close-btn {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
        padding: 0;
        color: #00000073;
        background: 0 0;
        border: 0;
        outline: 0;
        cursor: pointer;
        width: 57px;
        height: 57px;
    }
    .add-room-close-btn:hover {
        color: black;
    }
    .add-room-box {
        padding: 16px;
    }
    .add-room-select-box {
        padding: 16px;
    }
    .add-room-input-box {
        padding: 16px
    }
    @media screen and (max-height: 290px) {
        width: 300px;
        height: 200px;
        background-color: white;
        left: calc((100vw - 300px)/2);
        top: calc((100vh - 200px)/2);        
    }
    @media screen and (max-height: 220px) {
        display: none !important;
    }
`;

const AddRoomMemberModal = styled.div`
    position: absolute;
    z-index: 1002;
    width: 200px;
    height: 180px;
    background-color: white;
    right: 15%;
    top: 15%;
    .add-room-member-title {
        font-weight: 500;
        font-size: 16px;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
    }
    .add-room-member-close-btn {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 10;
        padding: 0;
        color: #00000073;
        background: 0 0;
        border: 0;
        outline: 0;
        cursor: pointer;
        width: 57px;
        height: 57px;
    }
    .add-room-member-close-btn:hover {
        color: black;
    }
    .add-room-member-box {
        padding: 16px;
    }
    @media screen and (max-height: 220px) {
        display: none !important;
    }
`;

const UnreadDot = styled.div`
    height: 12px;
    width: 12px;
    background: #0084ff;
    border-radius: 50%;
`;

const NoRoomWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const RoomHeader = styled.div`
    height: 10%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid #0000001a;
    background: white;
    @media screen and (max-height: 480px) {
        height: 20%;
        .room-header {
            width: 200px
        }
    }
    @media screen and (max-height: 350px) {
        height: 30%;
        .ant-btn {  
            display: none;
        }
    }
    @media screen and (max-height: 250px) {
        .room-header {
            width: 100px;
        }
    }
    @media screen and (max-height: 200px) {
        height: 40%;
    }
`;

const RoomContent = styled.div`
    height: 80%;
    padding: 20px;
    background-color: #f4f5f7;
    overflow: auto;
    .text-box-left{
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
        .text {
            margin-left: 20px;
            margin-right: 80px;
            color: #eee;
            background-color: #4179f1;
            &:before {
                border-right: 10px solid #4179f1;
                left: -10px;
            }
        }
        .time {
            margin-left: 20px;
        }
    }
    .text-box-right{
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
        justify-content: flex-end;
        .text-box {
            order: -1;
        }
        .text {
            margin-right: 20px;
            margin-left: 80px;
            background-color: #40ef29;
            color: #333;
            &:before {
                border-left: 10px solid #40ef29;
                right: -10px;
            }
        }
        .time {
            text-align: right;
            margin-right: 20px;
        }
    }
    .avatar {
        text-align: center;
        font-size: 15px;
        width: 60px;
    }
    .text {
        background-color: #aaa;
        padding: 16px;
        border-radius: 10px;
        position: relative;
        font-weight: bolder;
        box-shadow: 0 0 5px #888;
        max-width: 300px;
        overflow-wrap: break-word;
        &:before {
            content: "";
            position: absolute;
            top: 20px;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
        }
    }
    .system-message {
        text-align: center;
        margin-bottom: 20px;
        font-weight: bolder;
        color: darkgray;
    }
    @media screen and (max-height: 350px) {
        .text {
            max-width: 150px;
        }
    }
    @media screen and (max-height: 200px) {
        .text {
            max-width: 75px;
        }
    }
`;

const RoomFooter = styled.div`
    height: 10%;
    background: white;
`;

const InputBox = styled.div`
    width: 100%;
    padding: 20px;  
`

const stringAvatar = (name) => {
    return {
        sx: {  
            mr: '8px',
            bgcolor: stringToColor(name),
        },
        children: `${name.substr(0,1)}`,
    };
};

const stringToColor = (name) => {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < name.length; i += 1) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    };

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    };
    /* eslint-enable no-bitwise */
  
    return color;
};

const getSubTitle = (messages) => {
    const message = messages[messages.length-1];
    if(!message){
        return 'No messages...';
    }else{
        if(message.sender==='0308F'){
            return message.text;
        }
        return `${message.sender}: ${message.text}`;
    };
};

const ckeckUnread = (viewTime, messages) => {
    const message = messages[messages.length-1];
    if(!message){
        return false;
    }else{
        return new Date(message.timestamp).getTime()-new Date(viewTime).getTime()>0;
    };
};

const getOptionNode = (members, friends) => {
    return friends.map(friend => {
        if(members.some(member => member===friend)){
            return (<Option value={friend} key={friend} disabled>{friend}</Option>);
        }else{
            return (<Option value={friend} key={friend}>{friend}</Option>);
        };
    });
};

const ChatRooms = ({ navigate, me, ME, ROOM, activeRoom, setActiveRoom, handleWait }) => {
    const [createRoom] = useMutation(CREATE_ROOM_MUTATION);
    const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
    const [leaveRoom] = useMutation(LEAVE_ROOM_MUTATION);
    const [updateMessagesViewTime] = useMutation(UPDATE_MESSAGES_VIEW_TIME_MUTATION);
    const [deleteMessage] = useMutation(DELETE_MESSAGE_MUTATION);
    const [addRoomMember] = useMutation(ADD_ROOM_MEMBER_MUTATION);
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);
    const [openAddRoomMemberModal, setOpenAddRoomMemberModal] = useState(false);
    const [pick, setPick] = useState(null);
    const [selects, setSelects] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [text, setText] = useState("");
    const [openMask, setOpenMask] = useState(false);
    const ref = useRef(null);
    const ref2 = useRef(null);

    const scrollToBottom = () => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToTop = () => {
        ref2.current?.scrollIntoView({ behavior: "instant" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [ROOM]);

    useEffect(() => {
        if(activeRoom){
            ref.current?.scrollIntoView({ behavior: "instant" });
        };
    }, [activeRoom]);

    useEffect(() => {
        let id = null;
        if(activeRoom){
            id = setTimeout(() => {
                updateMessagesViewTime({
                    variables: {
                        roomId: activeRoom,
                        userName: me,
                    },
                });
            }, 3000);
            return () => {
                clearTimeout(id);
            };
        };
    }, [ROOM]);
    
    const handleCreateRoom = () => {
        if(selects.length===0){
            displayStatus({ type: "error", msg: "At least one member." });
            return;
        }else if(roomName.trim().length===0){
            displayStatus({ type: "error", msg: "Invaild room name." });
            return;
        };
        const members = [me, ...selects.filter(member => member!==me)]
        const rId = uuidv4();
        createRoom({
            variables: {
                roomName,
                roomId: rId,
                members,
            },
            onCompleted: ({ createRoom }) => {
                if(createRoom){
                    displayStatus({ type: 'success', msg: "Created Successfully!" });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        setSelects([]);
        setRoomName("");
        setOpenCreateRoomModal(false);
        handleChangeActiveRoom(rId);
        scrollToTop();
    };

    const handleSendMessage = () => {
        if(!text.trim()) return;
        sendMessage({
            variables: {
                roomId: activeRoom,
                sender: me,
                messageId: uuidv4(),
                text,
            },
        });
        setText("");
    };

    const handleLeaveRoom = () => {
        leaveRoom({
            variables: {
                roomId: activeRoom,
                userName: me,
            },
            onCompleted: ({ leaveRoom }) => {
                if(leaveRoom){
                    displayStatus({ type: 'info', msg: "Left Room." });
                    setActiveRoom(null);
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        handleWait(1);
    };

    const handleChangeActiveRoom = (roomId) => {
        if(activeRoom){
            updateMessagesViewTime({
                variables: {
                    roomId: activeRoom,
                    userName: me,
                },
            });
        };
        setActiveRoom(roomId);
        updateMessagesViewTime({
            variables: {
                roomId: roomId,
                userName: me,
            },
        });
    };

    const handleDeleteMessage = (roomId, messageId) => {
        setOpenMask(false);
        deleteMessage({
            variables: {
                roomId,
                messageId,
            },
            onCompleted: ({ deleteMessage }) => {
                if(deleteMessage){
                    displayStatus({ type: 'info', msg: "Message Deleted." });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
    };

    const handleAddRoomMember = () => {
        if(!pick) return;
        addRoomMember({
            variables: {
                roomId: activeRoom,
                from: me,
                to: pick,
            },
            onCompleted: ({ addRoomMember }) => {
                if(addRoomMember){
                    displayStatus({ type: 'success', msg: "Added Successfully!" });
                }else{
                    displayStatus({ type: 'error', msg: "Ooops! something went wrong." });
                };
            },
        });
        setPick(null);
        setOpenAddRoomMemberModal(false);
    };

    const getRoomNode = ({ roomName, roomId, members, messages }) => {
        return (
            <>
                <RoomHeader>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar {...stringAvatar(roomName)}/>
                        <div>
                            <Typography className='room-header' sx={{ fontSize: '1.5rem', fontWeight: 'bolder', maxWidth: 300, lineHeight: 1 }} noWrap>{roomName}</Typography> 
                            <Typography className='room-header' sx={{ fontSize: '0.8rem', fontWeight: 'bolder', maxWidth: 300, color: 'darkgray' }} noWrap>{`Room members: ${members.join(', ')}`}</Typography>
                        </div> 
                    </div>
                    <div style={{ display: 'flex' }}>
                        <Button type="primary" style={{ marginRight: '10px' }} onClick={() => setOpenAddRoomMemberModal(true)} ghost>Add Member</Button>
                        <Button type="primary" onClick={handleLeaveRoom} danger ghost>Leave Room</Button>
                    </div>                         
                </RoomHeader>
                <RoomContent>
                    {messages.map(({ sender, messageId, text, timestamp }) => {
                        if(sender==='0308F'){
                            return (<div className='system-message' key={messageId}>{text}</div>)
                        }
                        
                        return (<div className={sender===me?'text-box-right':'text-box-left'} key={messageId}>
                                    <div className='avatar'>
                                        <Avatar sx={{ margin: 'auto', cursor: 'pointer' }} src={ME.me.users.headShotURLs[sender]} onClick={sender===me? () => navigate('/me'):() => navigate(`/visits/${sender}`)}/> 
                                        <Typography variant="inherit" noWrap>
                                            {sender}
                                        </Typography>
                                    </div>
                                    <div className='text-box'>
                                        {sender===me? (
                                            <Popconfirm title="Delete this message？" okText="Yes" cancelText="No" onConfirm={() => handleDeleteMessage(roomId, messageId)} onCancel={() => setOpenMask(false)}>
                                                <div className='text' onClick={() => setOpenMask(true)}>{text}</div>
                                            </Popconfirm>
                                        ) : (
                                            <div className='text'>{text}</div>
                                        )}
                                        <div className='time'>{moment(timestamp).fromNow()}</div>
                                    </div>
                                </div>);
                    })}
                    <div ref={ref}/>
                </RoomContent>
                <RoomFooter>
                    <InputBox>
                        <Input.Search
                            value={text}
                            enterButton="Send"
                            placeholder="Type a message here..."
                            onChange={(e) => setText(e.target.value)}
                            onSearch={handleSendMessage}
                            maxLength={300}
                        ></Input.Search>
                    </InputBox>
                </RoomFooter>
                <AddRoomMemberModal style={{ display: openAddRoomMemberModal?'block':'none' }}>
                        <div className="add-room-member-title">Add Member</div>
                        <button 
                            className="add-room-member-close-btn" 
                            onClick={() => {
                                setOpenAddRoomMemberModal(false);
                                setPick(null);
                            }}
                        >
                            <CloseOutlined />
                        </button>
                        <div className="add-room-member-box">
                            <div style={{ marginBottom: 10 }}>
                                <Select value={pick} style={{ width: 120 }} onChange={(value) => setPick(value)}>
                                    {getOptionNode(members, ME.me.friends)}
                                </Select>
                            </div>
                            <Button type="primary" onClick={handleAddRoomMember}>Add</Button>
                        </div>
                </AddRoomMemberModal>
            </>
        );
    };

    return(
        <> 
            {ME && ROOM? (
                <>
                    <RoomListWrapper>
                        <div className='room-list-header'>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 'bolder' }} noWrap>{`${me}'s Room`}</Typography>
                            <IconButton
                                className='add-room-btn'
                                size="large"
                                color="inherit"
                                onClick={() => setOpenCreateRoomModal(true)}
                            >
                                <AddCircleIcon />
                            </IconButton>
                        </div>
                        <div className='room-list-content'>
                            <div ref={ref2}></div>
                            <List sx={{ bgcolor: 'background.paper', width: '100%' }} component="nav" aria-label="mailbox folders">
                                    {ROOM.room.map(({ roomName, roomId, messages, viewTime }) => (
                                        <ListItem button divider key={roomId} onClick={() => handleChangeActiveRoom(roomId)}>
                                             <Avatar {...stringAvatar(roomName)}/>
                                            <ListItemText primary={(<Typography sx={{ fontWeight: 'bolder' }} noWrap>{roomName}</Typography>)} secondary={(<Typography sx={{ color: '#00000099', fontSize: '0.875rem' }} noWrap>{getSubTitle(messages)}</Typography>)} disableTypography/>
                                            {ckeckUnread(viewTime, messages) && roomId!==activeRoom?<div><UnreadDot /></div>:<></>}
                                        </ListItem>
                                    ))}
                            </List>
                        </div>
                    </RoomListWrapper>

                    <Content style={{ background: 'white' }}>
                        {ROOM.room.some(({ roomId }) => roomId===activeRoom)? (
                            <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
                                {getRoomNode(ROOM.room.find(({ roomId }) => roomId===activeRoom))}
                            </div>
                        ) : (
                            <NoRoomWrapper>
                                <Typography sx={{ color: '#65676b', fontWeight: 'bolder', fontSize: 24 }}noWrap>選擇聊天室或開始新對話</Typography>
                            </NoRoomWrapper>
                        )}
                    </Content>

                    <Mask style={{ display: openCreateRoomModal || openAddRoomMemberModal || openMask ?'block':'none' }} onClick={() => {if(openMask) setOpenMask(false)}}/>
                    <CreateRoomModal style={{ display: openCreateRoomModal?'block':'none' }}>
                        <div className="add-room-title">Create Room</div>
                        <button className="add-room-close-btn" onClick={() => setOpenCreateRoomModal(false)}><CloseOutlined /></button>
                        <div className="add-room-box">
                            <div className="add-room-select-box">
                                <Select
                                    value={selects}
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder="Click to select..."
                                    onChange={(users) => setSelects([...users])}
                                >   
                                    {
                                        [me, ...ME.me.friends].map(
                                            user => <Option key={user}>{user}</Option>
                                        )
                                    }
                                </Select>
                            </div>
                            <div className="add-room-input-box">
                                <Input.Group>
                                    <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} style={{ width: 'calc(100% - 200px)' }} placeholder="Input room name" maxLength={30}/>
                                    <Button type="primary" onClick={handleCreateRoom}>Create</Button>
                                </Input.Group>
                            </div>
                        </div>
                    </CreateRoomModal>
                </>
            ):(
                <></>
            )}
        </>
    );
};

export default ChatRooms;