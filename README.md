## Demo
[Demo Link](https://youtu.be/yEc1Ph_MGXU)

## Deploy
[Deploy Link](http://44.212.241.217)


## Introduction
A social media application refer to Facebook

## Service
* Registration and login, logout
* Personal page and main page
* Adding friends on Fakebook and view their profile
* Post, delete and edit the posts
* Leave your comment and like the posts
* A chatroom to talk with your friends

## 使用之第三方套件、框架、程式碼
* **Frontend:** React, graphql, Cookie, react-router-dom, apollo, Material-UI, Ant Design, uuid, moment, react-router-dom, moment, XML
* **Backend:** mongoose, express, bcrypt, cors, dotenv-defaults, uuid, apollo-server-express

## Structure
```
.
└── backend
    ├── models.js
    │   ├── User
    │   ├── ChatRoom
    │   └── Post
    ├── mongo.js
    ├── resolvers.js
    │   ├── mutations.js
    │   ├── queries.js
    │   └── subscriptions.js
    ├── schema.graphql
    └── server.js

.
└── frontend
    ├── component
    │   ├── constants.js
    │   ├── displayStatus.js
    │   ├── posts.js
    │   │   └── post.js
    │   └── visit.js
    ├── App.test.js
    ├── index.js
    ├── reportWebVitals.js
    ├── setupTests.js
    ├── container
    │   ├── signIn.js
    │   ├── me.js
    │   ├── App.css
    │   ├── App.js
    │   ├── posts.js
    │   └── chatRoom.js
    └── graphql
        ├── index.js
        ├── mutation.js
        ├── queries.css
        └── subscription.js
```


## Run in local
1. yarn install
2. yarn build
3. yarn start
4. open your localhost with port 80, and you will see our website
