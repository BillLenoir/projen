"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@apollo/server");
var standalone_1 = require("@apollo/server/standalone");
// This is where the data file that lists all of the games the Board Game Geek
// says I have a relationship with either because I own it, want to buy it,
// previously owned it, or want to sell or trade it.
var typeDefs_js_1 = require("./data/typeDefs.js");
var resolvers_js_1 = require("./resolvers.js");
// import { Game, QueryFindGamesArgs, Resolvers } from './resolvers-types.js';
// The ApolloServer requires these two parameters.
var server = new server_1.ApolloServer({
    typeDefs: typeDefs_js_1.typeDefs,
    resolvers: resolvers_js_1.resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
var url = (await (0, standalone_1.startStandaloneServer)(server, {
    listen: { port: 4000 },
})).url;
console.log("\uD83D\uDE80  Server ready at ".concat(url));
