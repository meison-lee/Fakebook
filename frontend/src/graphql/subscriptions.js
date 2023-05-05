import { gql } from "@apollo/client";

export const PUBLIC_USER_SUBSCRIPTION = gql`
    subscription {
        publicUser {
            mutation
            data
        }
    }
`;

export const ME_SUBSCRIPTION = gql`
    subscription($query: ID!) {
        me(query: $query) {
            mutation
            data
        }
    }
`;

export const ROOM_SUBSCRIPTION = gql`
    subscription($query: ID!) {
        room(query: $query) {
            mutation
            data
        }
    }
`;

export const PUBLIC_POST_SUBSCRIPTION = gql`
    subscription {
        publicPost {
            mutation
            data
        }
    }
`;

export const POST_SUBSCRIPTION = gql`
    subscription($query: ID!) {
        post(query: $query) {
            mutation
            data
        }
    }
`; 