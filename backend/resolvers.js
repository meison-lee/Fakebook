import  { GraphQLScalarType } from 'graphql';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const resolvers = {
    Query: {
        async me(parent, { query }, { db, pubSub }, info) {
            return await db.UserModel.findOne({ userName: query });
        },
        async visit(parent, { query }, { db, pubSub }, info) {
            return await db.UserModel.findOne({ userName: query });
        },
        async post(parent, { query }, { db, pubSub }, info) {
            const posts = await db.PostModel.find({}).sort({ createTime: -1 });
            const { friends } = await db.UserModel.findOne({ userName: query });
            return posts.filter(post => post.published==="Public" || post.author===query || (post.published==="Friends" && friends.some(friend => friend===post.author)));
        },
        async room(parent, { query }, { db, pubSub }, info) {
            const rooms = await db.ChatRoomModel.find({ 'members.name': query }).sort({ 'members.viewTime': -1 });
            return rooms.map(({ _id, roomName, roomId, members, messages, createTime }) => ({
                _id,
                roomName,
                roomId,
                members: members.map(member => member.name),
                messages,
                viewTime: members.find(member => member.name===query).viewTime,
                createTime,
            }));
        },
    },
    Mutation: {
        async createUser(parent, { data: { userName, password } }, { db, pubSub }, info) {
            if(await db.UserModel.findOne({ userName })){
                return false;
            };
            const now = new Date();
            const init = new Date(0);
            await new db.UserModel({
                userName,
                password: await bcrypt.hash(password, 10),
                birthday: "",
                from: "",
                liveIn: "",
                school: "",
                email: "",
                phone: "",
                instagram: "",
                website: "",
                about: "",
                github: "",
                position: "",
                company: "",
                friends: [],
                requests: [],
                invitations: [],
                headShotURL: "",
                headShotUpdateTime: init,
                notifications: [{ info: `${userName}, Welcome to Fakebook!`, timestamp: now }],
                notificationsViewTime: init,
                createTime: now,
            }).save();
            pubSub.publish("Public User", {
                publicUser: {
                    mutation: 'NEW_USER_CREATED',
                    data: { userName },
                },
            });
            return true;
        },
        async signIn(parent, { data }, { db, pubSub }, info) {
            const user = await db.UserModel.findOne({ userName: data.userName });
            if(user && await bcrypt.compare(data.password, user.password)){
                return true;
            }
            return false;
        },
        async updateHeadShot(parent, { data: { userName, headShotURL, updateType } }, { db, pubSub }, info) {
            const user = await db.UserModel.findOne({ userName });
            if(updateType==='IMGUR'){
                user.headShotUpdateTime = new Date();
            }
            user.headShotURL = headShotURL;
            await user.save();
            pubSub.publish("Public User", {
                publicUser: {
                    mutation: 'HEAD_SHOT_UPDATED',
                    data: { userName, headShotURL, headShotUpdateTime: user.headShotUpdateTime },
                },
            });
            return true;
        },
        async updateInfo(parent, { data }, { db, pubSub }, info) {
            await db.UserModel.updateOne({ userName: data.userName }, { ...data });
            pubSub.publish(data.userName, {
                me: {
                    mutation: 'INFO_UPDATED',
                    data: { ...data },
                },
            });
            return true;
        },
        async addFriend(parent, { data }, { db, pubSub }, info) {
            const now = new Date();
            const from = await db.UserModel.findOne({ userName: data.from });
            if(from.requests.some(request => request===data.to)) return false;
            const to = await db.UserModel.findOne({ userName: data.to });
            if(to.invitations.some(invitation => invitation===data.from)) return false;
            from.requests.push(data.to);
            from.notifications.unshift({ info: `You sent a friend request to ${data.to}.`, timestamp: now });
            to.invitations.push(data.from);
            to.notifications.unshift({ info: `${data.from} want to be your friend.`, timestamp: now });
            await from.save();
            await to.save();
            pubSub.publish(data.from, {
                me: {
                    mutation: 'FRIEND_ADDED_FROM',
                    data: { to: data.to, notification: from.notifications[0] },
                },
            });
            pubSub.publish(data.to, {
                me: {
                    mutation: 'FRIEND_ADDED_TO',
                    data: { from: data.from, notification: to.notifications[0] },
                },
            });
            return true;
        },
        async acceptRequest(parent, { data }, { db, pubSub }, info) {
            const now = new Date();
            const from = await db.UserModel.findOne({ userName: data.from });
            if(from.friends.some(friend => friend===data.to)) return false;
            const to = await db.UserModel.findOne({ userName: data.to });
            if(to.friends.some(friend => friend===data.from)) return false;
            from.invitations = from.invitations.filter(user => user!==data.to);
            from.notifications.unshift({ info: `Congratulations! You and ${data.to} became friend on Bongo.`, timestamp: now });
            from.friends.push(data.to);
            to.requests = to.requests.filter(user => user!==data.from);
            to.notifications.unshift({ info: `Congratulations! ${data.from} accepted your friend request.`, timestamp: now });
            to.friends.push(data.from);
            await from.save();
            await to.save();
            pubSub.publish(data.from, {
                me: {
                    mutation: 'FRIEND_ACCEPTED_FROM',
                    data: { to: data.to, notification: from.notifications[0] },
                },
            });
            pubSub.publish(data.to, {
                me: {
                    mutation: 'FRIEND_ACCEPTED_TO',
                    data: { from: data.from, notification: to.notifications[0] },
                },
            });
            return true;
        },
        async rejectRequest(parent, { data }, { db, pubSub }, info) {
            const now = new Date();
            const from = await db.UserModel.findOne({ userName: data.from });
            if(!from.invitations.find(user => user===data.to)) return false;
            const to = await db.UserModel.findOne({ userName: data.to });
            if(!to.requests.find(request => request===data.from)) return false;
            from.invitations = from.invitations.filter(user => user!==data.to);
            from.notifications.unshift({ info: `You rejected ${data.to}'s friend request.`, timestamp: now });
            to.requests = to.requests.filter(user => user!==data.from);
            to.notifications.unshift({ info: `Oops! ${data.from} rejected your friend request.`, timestamp: now });
            await from.save();
            await to.save();
            pubSub.publish(data.from, {
                me: {
                    mutation: 'FRIEND_REJECTED_FROM',
                    data: { to: data.to, notification: from.notifications[0] },
                },
            });
            pubSub.publish(data.to, {
                me: {
                    mutation: 'FRIEND_REJECTED_TO',
                    data: { from: data.from, notification: to.notifications[0] },
                },
            });
            return true;
        },
        async updateNotificationsViewTime(parent, { query }, { db, pubSub }, info) {
            const now = new Date();
            await db.UserModel.updateOne({ userName: query }, { notificationsViewTime: now });
            pubSub.publish(query, {
                me: {
                    mutation: 'NOTIFICATIONS_VIEW_TIME_UPDATED',
                    data: { notificationsViewTime: now },
                },
            });
            return true;
        },
        async createPost(parent, { data }, { db, pubSub }, info) {
            const post = new db.PostModel({
                ...data,
                likes: [],
                comments: [],
                createTime: new Date(),
            });
            await post.save();
            switch(data.published) {
                case 'Public': {
                    pubSub.publish('Public Post', {
                        publicPost: {
                            mutation: 'POST_CREATED',
                            data: { post },
                        },
                    });
                    break;
                }
                case 'Friends': {
                    const user = await db.UserModel.findOne({ userName: data.author });
                    user.friends.forEach(friend => {
                        pubSub.publish(`${friend}'s Post`, {
                            post: {
                                mutation: 'POST_CREATED',
                                data: { post },
                            },
                        });
                    });
                    pubSub.publish(`${data.author}'s Post`, {
                        post: {
                            mutation: 'POST_CREATED',
                            data: { post },
                        },
                    });
                    break;
                }
                default: {
                    pubSub.publish(`${data.author}'s Post`, {
                        post: {
                            mutation: 'POST_CREATED',
                            data: { post },
                        },
                    });
                }
            };
            return true;
        },
        async updatePost(parent, { data }, { db, pubSub }, info) {
            await db.PostModel.updateOne({ postId: data.postId }, { ...data });
            const post = await db.PostModel.findOne({ postId: data.postId });
            if(!post) return false;
            pubSub.publish(`${post.author}'s Post`, {
                post: {
                    mutation: 'POST_UPDATED',
                    data: { post },
                },
            });
            return true;
        },
        async deletePost(parent, { postId }, { db, pubSub }, info) {
            await db.PostModel.deleteOne({ postId });
            pubSub.publish('Public Post', {
                publicPost: {
                    mutation: 'POST_DELETED',
                    data: { postId },
                },
            });
            return true;
        },
        async createComment(parent, { data }, { db, pubSub }, info) {
            const { postId, author, commentId, text } = data;
            const post = await db.PostModel.findOne({ postId });
            if(!post) return false;
            const now = new Date();
            post.comments.push({ author, commentId, text, timestamp: now });
            await post.save();
            if(post.author!==author){
                const user = await db.UserModel.findOne({ userName: post.author });
                user.notifications.unshift({ info: `${data.author} left a comment on your post.`, timestamp: now });
                await user.save();
                pubSub.publish(user.userName, {
                    me: {
                        mutation: 'NOTIFICATIONS_UPDATED',
                        data: { notification: user.notifications[0] },
                    },
                });
            };
            pubSub.publish('Public Post', {
                publicPost: {
                    mutation: 'COMMENT_CREATED',
                    data: { postId, comment: { author, commentId, text, timestamp: now } },
                },
            });
            return true;
        },
        // async updateComment(parent, { data }, { db, pubSub }, info) {
        //     const { postId, commentId, text } = data;
        //     const post = await db.PostModel.findOne({ postId });
        //     post.comments.find(comment => comment.commentId===commentId).text = text;
        //     await post.save();
        //     pubSub.publish('Public Post', {
        //         publicPost: {
        //             mutation: 'COMMENT_UPDATED',
        //             data: { postId, commentId, text },
        //         },
        //     });
        //     return true;
        // },
        async deleteComment(parent, { data: { postId, commentId } }, { db, pubSub }, info) {
            const post = await db.PostModel.findOne({ postId });
            if(!post) return false;
            post.comments = post.comments.filter(comment => comment.commentId!==commentId);
            await post.save();
            pubSub.publish('Public Post', {
                publicPost: {
                    mutation: 'COMMENT_DELETED',
                    data: { postId, commentId },
                },
            });
            return true;
        },
        async like(parent, { data: { postId, userName } }, { db, pubSub }, info) {
            const post = await db.PostModel.findOne({ postId });
            if(!post) return false;
            if(post.likes.some(like => like===userName)) return false;
            post.likes.push(userName);
            await post.save();
            if(post.author!==userName){
                const user = await db.UserModel.findOne({ userName: post.author });
                user.notifications.unshift({ info: `${userName} liked your post.`, timestamp: new Date() });
                await user.save();
                pubSub.publish(user.userName, {
                    me: {
                        mutation: 'NOTIFICATIONS_UPDATED',
                        data: { notification: user.notifications[0] },
                    },
                });
            };
            pubSub.publish('Public Post', {
                publicPost: {
                    mutation: 'LIKE',
                    data: { postId, userName },
                },
            });
            return true;
        },
        async unlike(parent, { data: { postId, userName } }, { db, pubSub }, info) {
            const post = await db.PostModel.findOne({ postId });
            if(!post) return false;
            post.likes = post.likes.filter(like => like!==userName);
            await post.save();
            pubSub.publish('Public Post', {
                publicPost: {
                    mutation: 'UNLIKE',
                    data: { postId, userName },
                },
            });
            return true;
        },
        async createRoom(parent, { data: { roomName, roomId, members } }, { db, pubSub }, info) {
            const now = new Date();
            const init = new Date(0);
            const room = await new db.ChatRoomModel({
                roomName,
                roomId,
                members: members.map(member => ({ name: member, viewTime: init })),
                messages: [{ sender: '0308F', messageId: uuidv4(), text: `${members[0]} created the room.`, timestamp: now }],
                createTime: now,
            }).save();
            const users  = await db.UserModel.find({ userName: { $in: members }});
            users.forEach(async user => {
                user.userName===members[0]?user.notifications.unshift({ info: `ChatRoom \"${roomName}\" created successfully!`, timestamp: now })
                :user.notifications.unshift({ info: `${members[0]} invited you to Cha Cha in ChatRoom \"${roomName}\".`, timestamp: now });
                await user.save();
                pubSub.publish(user.userName, {
                    me: {
                        mutation: 'NOTIFICATIONS_UPDATED',
                        data: { notification: user.notifications[0] },
                    },
                });
            });
            members.forEach(member => {
                pubSub.publish(`${member}'s Room`, {
                    room: {
                        mutation: 'ROOM_CREATED',
                        data: { _id: room._id, roomName, roomId, members, messages: room.messages, viewTime: init },
                    },
                });
            });
            return true;
        },
        async sendMessage(parent, { data }, { db, pubSub }, info) {
            const { roomId, sender, messageId, text } = data;
            const room = await db.ChatRoomModel.findOne({ roomId });
            if(!room) return false;
            const now = new Date();
            room.messages.push({ sender, messageId, text, timestamp: now });
            room.members.find(member => member.name===sender).viewTime = now;
            await room.save();
            room.members.forEach(member => {
                pubSub.publish(`${member.name}'s Room`, {
                    room: {
                        mutation: 'MESSAGE_SENT',
                        data: { ...data, timestamp: now },
                    },
                });
            });
            return true;
        },
        async deleteMessage(parent, { data: { roomId, messageId } }, { db, pubSub }, info) {
            const room = await db.ChatRoomModel.findOne({ roomId });
            if(!room) return false;
            const message = room.messages.find(message => message.messageId===messageId);
            if(!message) return false;
            message.text = `${message.sender} unsent the message.`
            message.sender = '0308F';
            await room.save();
            room.members.forEach(member => {
                pubSub.publish(`${member.name}'s Room`, {
                    room: {
                        mutation: 'MESSAGE_DELETED',
                        data: { roomId, messageId , sysMsg: message },
                    },
                });
            });
            return true;
        },
        async updateMessagesViewTime(parent, { data: { roomId, userName } }, { db, pubSub }, info) {
            const now = new Date();
            const room = await db.ChatRoomModel.findOne({ roomId });
            if(!room) return false;
            const member = room.members.find(member => member.name===userName);
            if(!member) return false;
            member.viewTime = now;
            await room.save();
            pubSub.publish(`${userName}'s Room`, {
                room: {
                    mutation: 'MESSAGES_VIEW_TIME_UPDATED',
                    data: { roomId, viewTime: now },
                },
            });
            return true;
        },
        async addRoomMember(parent, { data: { roomId, from, to } }, { db, pubSub }, info) {
            const room = await db.ChatRoomModel.findOne({ roomId });
            if(!room) return false
            if(room.members.some(member => member.name===to)) return false;
            const init = new Date(0);
            const now = new Date();
            room.members.push({ name: to, viewTime: init });
            room.members.find(member => member.name===from).viewTime = now;
            room.messages.push({ sender: '0308F', messageId: uuidv4(), text: `${from} added ${to} to the room.`, timestamp: now });
            await room.save();
            const user = await db.UserModel.findOne({ userName: to });
            user.notifications.unshift({ info: `${from} invited you to Cha Cha in ChatRoom \"${room.roomName}\".`, timestamp: now });
            await user.save();
            pubSub.publish(to, {
                me: {
                    mutation: 'NOTIFICATIONS_UPDATED',
                    data: { notification: user.notifications[0] },
                },
            });
            room.members.forEach(member => {
                if(member.name!==to){
                    pubSub.publish(`${member.name}'s Room`, {
                        room: {
                            mutation: 'ROOM_MEMBER_ADDED',
                            data: { roomId, from, to,  sysMsg: room.messages[room.messages.length-1] },
                        },
                    });
                }else{
                    pubSub.publish(`${member.name}'s Room`, {
                        room: {
                            mutation: 'ROOM_CREATED',
                            data: {
                                _id: room._id,
                                roomName: room.roomName,
                                roomId,
                                members: room.members.map(member => member.name),
                                messages: room.messages,
                                viewTime: init,
                                createTime: room.createTime,
                            },
                        },
                    });
                };
            });
            return true;
        },
        async leaveRoom(parent, { data: { roomId, userName } }, { db, pubSub }, info) {
            const room = await db.ChatRoomModel.findOne({ roomId });
            if(!room) return false;
            if(room.members.length===1){
                await db.ChatRoomModel.deleteOne({ roomId });
            }else{
                if(!room.members.find(member => member.name===userName)) return false;
                room.members = room.members.filter(member => member.name!==userName);
                room.messages.push({ sender: '0308F', messageId: uuidv4(), text: `${userName} left the room.`, timestamp: new Date() });
                await room.save();
                room.members.forEach(member => {
                    pubSub.publish(`${member.name}'s Room`, {
                        room: {
                            mutation: 'ROOM_MEMBER_LEFT',
                            data: { roomId, userName, sysMsg: room.messages[room.messages.length-1] },
                        },
                    })
                });
            }
            pubSub.publish(`${userName}'s Room`, {
                room: {
                    mutation: 'ROOM_LEFT',
                    data: { roomId },
                },
            });
            return true;
        },
    },
    Subscription: {
        publicUser: {
            subscribe: (parent, args, { pubSub }) => {
              return pubSub.asyncIterator("Public User");
            },
        },
        me: {
            subscribe: (parent, { query }, { pubSub }) => {
              return pubSub.asyncIterator(`${query}`);
            },
        },
        room: {
            subscribe: (parent, { query }, { pubSub }) => {
                return pubSub.asyncIterator(`${query}'s Room`);
            },
        },
        publicPost: {
            subscribe: (parent, args, { pubSub }) => {
              return pubSub.asyncIterator("Public Post");
            },
        },
        post: {
            subscribe: (parent, { query }, { pubSub }) => {
                return pubSub.asyncIterator(`${query}'s Post`);
            },
        },
    },
    User: {
        async users(parent, args, { db, pubSub }, info){
            const users = await db.UserModel.find({});
            const headShotURLs = {};
            const usersList = []
            users.map(({ userName, headShotURL }) => {
                usersList.push(userName);
                headShotURLs[userName] = headShotURL;
            });
            return { usersList, headShotURLs  };
        },
    },
    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        serialize(value) {
            // value sent to the client
            return value;
        },
        parseValue(value) {
            // value from the client (variables)
            return value;
        },
        parseLiteral(ast) {
            // value from the client (inline)
            // ast value is always in string format
            //
            return null;
        },
    }),
    Payload: new GraphQLScalarType({
        name: 'Payload',
        description: 'Payload custom scalar type',
        serialize(value) {
            return value;
        },
        parseValue(value) {
            return value;
        },
        parseLiteral(ast) {
            //
            return null;
        },
    }),
};

export { resolvers };