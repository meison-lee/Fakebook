import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: String,
    password: String,
    birthday: String,
    from: String,
    liveIn: String,
    school: String,
    email: String,
    phone: String,
    instagram: String,
    website: String,
    about: String,
    github: String,
    position: String,
    company: String,
    friends: Array,
    requests: Array,
    invitations: Array,
    headShotURL: String,
    headShotUpdateTime: Date,
    notifications:[{
        info: String,
        timestamp: Date,
    }],
    notificationsViewTime: Date,
    createTime: Date,
});

const ChatRoomSchema = new Schema({
    roomName: String,
    roomId: String,
    members: [{
        name: String,
        viewTime: Date,
    }],
    messages: [{
        sender: String,
        messageId: String,
        text: String,
        timestamp: Date,
    }],
    createTime: Date,    
});

const PostSchema = new Schema({
    author: String,
    postId: String,
    title: String,
    body: Array,
    tags: Array,
    image: String,
    published: String,
    likes: Array,
    comments: [{
        author: String,
        commentId: String,
        text: Array,
        timestamp: Date,
    }],
    createTime: Date,
});

const UserModel = mongoose.model("user", UserSchema);
const ChatRoomModel = mongoose.model("chatroom", ChatRoomSchema);
const PostModel = mongoose.model("post", PostSchema);

export default { UserModel, ChatRoomModel, PostModel };