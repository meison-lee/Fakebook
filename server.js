import express from "express";
import { ApolloServer, PubSub } from "apollo-server-express";
import { importSchema } from "graphql-import";
import cors from "cors";
import http from "http";
import "dotenv-defaults/config.js";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";


import connectMongoDB from './backend/mongo.js';
import db from './backend/models.js';
import { resolvers } from './backend/resolvers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 3000;

const typeDefs = importSchema("./backend/schema.graphql");
const pubSub = new PubSub();
const app = express();

// Cross-Origin Resource Sharing
// allow browser to make cross-origin requests from one domain to another
// security feature that restricts cross-origin HTTP requests
app.use(cors());

// build directory was created when we call yarn build(react-scripts build)
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    db,
    pubSub,
  },
});

server.applyMiddleware({ app });
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// take care of your IP address, if there is any out-bound restrction, you may not connect to Database successfully
connectMongoDB();

httpServer.listen(port, () => {
  console.log(`Server Ready at ${port}!`);
  console.log(`Graphql Port at ${port}${server.subscriptionsPath}`);
});
