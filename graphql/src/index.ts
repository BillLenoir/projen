import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { games } from './data/collectionData.js';
import { typeDefs } from './data/typeDefs.js';
import { Game, Resolvers } from './resolvers-types.js';

const resolvers: Resolvers = {
  Query: {
    games(_parent, args: { from: number; limit: number; sort: string; filter: string }) {
      let filterFunk: (game: Game) => boolean = () => true;
      if (args.filter === 'own') {
        filterFunk = (game: Game) => game.gameown === true;
      } else if (args.filter === 'want') {
        filterFunk = (game: Game) => game.gamewanttobuy === true;
      } else if (args.filter === 'prevown') {
        filterFunk = (game: Game) => game.gameprevowned === true;
      } else if (args.filter === 'trade') {
        filterFunk = (game: Game) => game.gamefortrade === true;
      }

      let filteredGames = games.filter(filterFunk);

      if (args.sort === 'id') {
        filteredGames.sort((a, b) => a.id - b.id);
      } else if (args.sort === 'title') {
        filteredGames.sort((a, b) => {
          const gameA = a.title?.toUpperCase() ?? '';
          const gameB = b.title?.toUpperCase() ?? '';
          if (gameA < gameB) {
            return -1;
          }
          if (gameB > gameB) {
            return 1;
          }
          return 0;
        });
      } else if (args.sort === 'yearpublished') {
        filteredGames.sort((a, b) => (a.yearpublished ?? 0) - (b.yearpublished ?? 0));
      } else {
        throw new Error('Something wrong with selected sort');
      }

      const returnedGames: Game[] = [];
      const from = (args.from - 1) * 50;
      const to =
        from + args.limit <= filteredGames.length
          ? from + args.limit
          : filteredGames.length - 1;
      console.log(filteredGames.length);

      for (let i = from; i < to; i++) {
        returnedGames.push(filteredGames[i]);
      }
      return returnedGames;
    },
    game(_parent, args: { title: string }) {
      return games.find((game) => game.title === args.title) ?? null;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
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
