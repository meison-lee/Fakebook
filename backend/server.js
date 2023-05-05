import connectMongoDB from './mongo';
import db from './models';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import { resolvers } from './resolvers';

connectMongoDB();

const pubSub = new PubSub();

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db,
        pubSub,
    },
});
  
server.start({ port: process.env.PORT | 4000 }, () => {
    console.log(`The server is up on port ${process.env.PORT | 4000}!`);
});