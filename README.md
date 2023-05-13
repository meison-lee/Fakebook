## Demo
[Demo Link](https://youtu.be/yEc1Ph_MGXU)

## Deploy
[Deploy Link](https://44.212.241.217)


## 服務介紹
Fakebook系統嘗試重現Facebook的功能、介面樣式。

這學期的課程中，接觸了帳號註冊、聊天室等等題目，透過課程了解前端設計、後端資料庫溝通等概念，因此小組討論後決定運用這些知識，以社群網站Facebook為目標，製作出具備相似功能的系統。

## 網站功能
* 註冊(帳號、密碼、信箱、電話)、登入
* 貼文首頁、個人頁面、新增個人簡介
* 尋找好友、加好友、邀請通知
* 發文、編輯、刪除文章
* 留言評論、喜歡貼文
* 聊天室、群組聊天

## 使用之第三方套件、框架、程式碼
* **Frontend:** React, graphql, Cookie, react-router-dom, apollo, Material-UI, Ant Design, uuid, moment, react-router-dom, moment, XML
* **Backend:** mongoose, express, bcrypt, cors, dotenv-defaults, uuid, apollo-server-express

## 程式架構
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
