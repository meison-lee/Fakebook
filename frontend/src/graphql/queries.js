import { gql } from "@apollo/client";

export const GET_ME_QUERY = gql`
    query($query: ID!) {
        me(query: $query) {
            userName
            birthday
            from
            liveIn
            school
            email
            phone
            instagram
            website
            about
            github
            position
            company
            friends
            requests
            invitations
            headShotURL
            headShotUpdateTime
            notifications
            notificationsViewTime
            users{
                usersList
                headShotURLs
            }
        }
    }
`;

export const GET_POST_QUERY = gql`
    query($query: ID!) {
        post(query: $query) {
            _id
            author
            postId
            title
            body
            tags
            image
            published
            likes
            comments
            createTime
        }
    }
`;

export const GET_ROOM_QUERY = gql`
    query($query: ID!) {
        room(query: $query) {
            _id
            roomName
            roomId
            members
            messages
            viewTime
        }
    }
`;

export const GET_VISIT_QUERY = gql`
    query($query: ID!) {
        visit(query: $query) {
            userName
            birthday
            from
            liveIn
            school
            email
            phone
            instagram
            website
            about
            github
            position
            company
        }
    }
`;
