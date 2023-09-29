import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// This is where the data file that lists all of the games the Board Game Geek
// says I have a relationship with either because I own it, want to buy it,
// previously owned it, or want to sell or trade it.
import { typeDefs } from './data/typeDefs.js';
import { resolvers } from './resolvers.js';
// import { Game, QueryFindGamesArgs, Resolvers } from './resolvers-types.js';

// The ApolloServer requires these two parameters.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at ${url}`);
