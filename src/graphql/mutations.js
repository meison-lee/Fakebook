import { gql } from "@apollo/client";

export const SIGN_IN_MUTATION = gql`
    mutation($userName: ID!, $password: String!) {
        signIn(data: { userName: $userName password: $password })
    }
`;

export const SIGN_UP_MUTATION = gql`
    mutation($userName: ID!, $password: String!) {
        createUser(data: { userName: $userName password: $password })
    }
`;

export const ACCEPT_REQUEST_MUTATION = gql`
    mutation($from: ID!, $to: ID!) {
        acceptRequest(data: { from: $from to: $to})
    }
`;

export const REJECT_REQUEST_MUTATION = gql`
    mutation($from: ID!, $to: ID!) {
        rejectRequest(data: { from: $from to: $to})
    }
`;

export const UPDATE_NOTIFICATIONS_VIEW_TIME_MUTATION = gql`
    mutation($query: ID!) {
        updateNotificationsViewTime(query: $query)
    }
`;

export const CREATE_ROOM_MUTATION = gql`
    mutation($roomName: String!, $roomId: ID!, $members: [ID!]!) {
        createRoom(data: { roomName: $roomName roomId: $roomId members: $members })
    }
`;

export const SEND_MESSAGE_MUTATION = gql`
    mutation($roomId: ID!, $sender: ID!, $messageId: ID!, $text: String!) {
        sendMessage(data: { roomId: $roomId sender: $sender messageId: $messageId text: $text })
    }
`;

export const LEAVE_ROOM_MUTATION = gql`
    mutation($roomId: ID!, $userName: ID!) {
        leaveRoom(data: { roomId: $roomId userName: $userName })
    }
`;

export const UPDATE_MESSAGES_VIEW_TIME_MUTATION = gql`
    mutation($roomId: ID!, $userName: ID!) {
        updateMessagesViewTime(data: { roomId: $roomId userName: $userName })
    }    
`;

export const DELETE_MESSAGE_MUTATION = gql`
    mutation($roomId: ID!, $messageId: ID!) {
        deleteMessage(data: { roomId: $roomId messageId: $messageId })
    }    
`;

export const ADD_ROOM_MEMBER_MUTATION = gql`
    mutation($roomId: ID!, $from: ID!, $to: ID!) {
        addRoomMember(data: { roomId: $roomId from: $from to: $to })
    }      
`;

export const CREATE_POST_MUTATION = gql`
    mutation($author: ID!, $postId: ID!, $title: String!, $body: [String!]!, $tags: [String!]!, $image: String!, $published: String!) {
        createPost(data: {
            author: $author
            postId: $postId
            title: $title
            body: $body
            tags: $tags
            image: $image
            published: $published
        })
    }
`;

export const DELETE_POST_MUTATION = gql`
    mutation($postId: ID!) {
        deletePost(postId: $postId)
    }
`;

export const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $author: ID!, $commentId: ID!, $text: [String!]!) {
        createComment(data: {
            postId: $postId
            author: $author
            commentId: $commentId
            text: $text
        })
    }
`;

export const DELETE_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $commentId: ID!) {
        deleteComment(data: {
            postId: $postId
            commentId: $commentId
        })
    }
`;

export const LIKE_MUTATION = gql`
    mutation($postId: ID!, $userName: ID!) {
        like(data: {
            postId: $postId
            userName: $userName
        })
    }
`;

export const UNLIKE_MUTATION = gql`
    mutation($postId: ID!, $userName: ID!) {
        unlike(data: {
            postId: $postId
            userName: $userName
        })
    }
`;

export const UPDATE_POST_MUTATION = gql`
    mutation($author: ID!, $postId: ID!, $title: String!, $body: [String!]!, $tags: [String!]!, $image: String!, $published: String!) {
        updatePost(data: {
            author: $author
            postId: $postId
            title: $title
            body: $body
            tags: $tags
            image: $image
            published: $published
        })
    }
`;

export const UPDATE_INFO_MUTATION = gql`
    mutation(
        $userName: ID!,
        $birthday: String!,
        $from: String!,
        $liveIn: String!,
        $school: String!,
        $email: String!,
        $phone: String!,
        $instagram: String!,
        $website: String!,
        $about: String!,
        $github: String!,
        $position: String!,
        $company: String!,
    ) {
        updateInfo(data: {
            userName: $userName
            birthday: $birthday
            from: $from
            liveIn: $liveIn
            school: $school
            email: $email
            phone: $phone
            instagram: $instagram
            website: $website
            about: $about
            github: $github
            position: $position
            company: $company
        })
    }
`;

export const ADD_FRIEND_MUTATION = gql`
    mutation($from: ID!, $to: ID!) {
        addFriend(data: { from: $from to: $to})
    }
`;

export const UPDATE_HEAD_SHOT_MUTATION = gql`
    mutation($userName: ID!, $headShotURL: String!, $updateType: String!) {
        updateHeadShot(data: { userName: $userName headShotURL: $headShotURL updateType: $updateType })
    }    
`;