import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// This is where the data file that lists all of the games the Board Game Geek
// says I have a relationship with either because I own it, want to buy it,
// previously owned it, or want to sell or trade it.
import { games } from './data/collectionData.js';
import { typeDefs } from './data/typeDefs.js';
import { Game, Resolvers } from './resolvers-types.js';

// This checks each game to see if it passes the filter check
// based on the games relationship to Billy's collection.
const filterCheck = (filter: string) => {
  let includedGame: (game: Game) => boolean = () => true;
  if (filter === 'own') {
    includedGame = (game: Game) => game.gameown === true;
  } else if (filter === 'want') {
    includedGame = (game: Game) => game.gamewanttobuy === true;
  } else if (filter === 'prevown') {
    includedGame = (game: Game) => game.gameprevowned === true;
  } else if (filter === 'trade') {
    includedGame = (game: Game) => game.gamefortrade === true;
  }
  return includedGame;
};

const resolvers: Resolvers = {
  Query: {

    // This will return the number of games in the filtered list
    // so that the client can implement the paginate UI.
    // THIS IS DUPLICATE CODE!
    listSize(_parent, args: {filter: string}) {
      // This is list of games filtered by the indicated parameter.
      let filteredGames = games.filter(filterCheck(args.filter));

      const returnedCount = { gameCount: filteredGames.length };
      return returnedCount;

    },

    // Returns a list of games starting at the CURSOR with a length of LIMIT.
    // Cannot assume the order of games in the list, so will always
    // filter by FILTER and sort by SORT parameters.
    games(_parent, args: { cursor: string; limit: number; sort: string; filter: string }) {
      console.log(args);
      // This is list of games filtered by the indicated parameter.
      let filteredGames = games.filter(filterCheck(args.filter));

      // The following will sort the filtered list of games by the indicated sort parameter.
      if (args.sort === 'id') { // This sorts the filtered games by ID.
        filteredGames.sort((a, b) => a.id - b.id);
      } else if (args.sort === 'title') { // This sorts the filtered games by title made uppercase.
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
      } else if (args.sort === 'yearpublished') { // Sorts the games by year published.
        filteredGames.sort((a, b) => (a.yearpublished ?? 0) - (b.yearpublished ?? 0));
      } else {
        throw new Error('Something wrong with selected sort');
      }

      const returnedGames: Game[] = [];
      let from: number = 0;
      // The cursor may be an object that may include multiple properties.
      // Year, definitely, and title, maybe, are not unique identifiers.
      // BUT, the cursor may also be blank, so...
      const cursor = args.cursor === '' ? '' : JSON.parse(args.cursor);

      // Given the CURSOR, we need the index of that game in the filtered and
      // sorted list as the point from which to start the list of games to return.
      let cursorGame: Game | null = null;
      if (cursor === '') {
        from = 0;
      } else {
        cursorGame = filteredGames.find((game) => game.id === cursor.id) ?? null;
      }

      // If the cursor does not point to a game in the list, we start from the beginning.
      if (cursorGame === null) {
        from = 0;
      } else {
        from = filteredGames.indexOf(cursorGame);
      }

      // Just in case we're at the end of the filtered and sorted list,
      // let's not run over!
      const limit = args.limit < filteredGames.length ? from + args.limit : filteredGames.length;

      // Just give the a list of games starting from the CURSOR's index
      // and including a number of games = to the LIMIT or whatever's left.
      for (let i = from; i < limit; i++) {
        returnedGames.push(filteredGames[i]);
      }

      return returnedGames;
    },

    // Return just a single game based on it's title. I haven't really worked
    // on this one yet.
    game(_parent, args: { title: string }) {
      return games.find((game) => game.title === args.title) ?? null;
    },
  },
};

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
