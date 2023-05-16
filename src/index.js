import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals.js';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    split,
    HttpLink,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import 'antd/dist/antd.css';

const url = new URL("/graphql", window.location.href);

const httpLink = new HttpLink({
    uri: url.href,
});
const wsLink = new WebSocketLink({
    uri: url.href.replace("http", "ws"),
    options: { reconnect: true },
});


// subscription request will send to wsLink
// other request will be send to httpLik
const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache().restore({}),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
