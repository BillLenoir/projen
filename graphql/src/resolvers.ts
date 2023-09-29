import { games } from './data/collectionData.js';
import { Filter, Game, Resolvers, Sort } from './resolvers-types.js';

// This checks each game to see if it passes the filter check
// based on the games relationship to Billy's collection.
const filterCheck = (filter: string) => {
  let includedGame: (game: Game) => boolean = () => true;
  if (filter === Filter.Own) {
    includedGame = (game: Game) => game.gameown === true;
  } else if (filter === Filter.Want) {
    includedGame = (game: Game) => game.gamewanttobuy === true;
  } else if (filter === Filter.Prevown) {
    includedGame = (game: Game) => game.gameprevowned === true;
  } else if (filter === Filter.Trade) {
    includedGame = (game: Game) => game.gamefortrade === true;
  }
  return includedGame;
};
export const resolvers: Resolvers = {
  Query: {
    findGames(_parent, args: { sort: Sort; filter: Filter; cursor: string; limit: number }) {

      let filteredGames = games.filter(filterCheck(args.filter));

      if (args.sort === Sort.Id) { // This sorts the filtered games by ID.
        filteredGames.sort((a, b) => a.id - b.id);
      } else if (args.sort === Sort.Title) { // This sorts the filtered games by title made uppercase.
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
      } else if (args.sort === Sort.Yearpublished) { // Sorts the games by year published.
        filteredGames.sort((a, b) => (a.yearpublished ?? 0) - (b.yearpublished ?? 0));
      } else {
        throw new Error('Something wrong with selected sort');
      }

      let from: number = 0;
      const cursor = args.cursor === '' ? '' : JSON.parse(args.cursor);
      let cursorGame: Game | null = null;
      let limit: number = 50;
      let hasNextPage: boolean = false;

      if (cursor != '') {
        cursorGame = filteredGames.find((game) => game.id === cursor.id) ?? null;
      }

      if (cursorGame != null) {
        from = filteredGames.indexOf(cursorGame);
      }

      if (args.limit < filteredGames.length) {
        limit = from + args.limit + 1;
        hasNextPage = true;
      } else {
        filteredGames.length;
      }

      const returnedGames = filteredGames.slice(from, limit);
      const lastGame = returnedGames.pop();
      let endCursor = '';
      if (lastGame) {
        endCursor = `{ "id": ${lastGame.id}, "title": ${lastGame.title}, "yearpublished": ${lastGame?.yearpublished} }`;
      }

      const gameNodes = [];
      for (let i = 0; i < returnedGames.length; i++) {
        const gameCursor = `{ "id": ${returnedGames[i].id}, "title": ${returnedGames[i].title}, "yearpublished": ${returnedGames[i].yearpublished} }`;
        const returnedGameNode = { game: returnedGames[i], cursor: gameCursor };
        gameNodes.push(returnedGameNode);
      }

      let returnObject = {
        totalCount: filteredGames.length,
        hasNextPage: hasNextPage,
        endCursor: endCursor,
        games: gameNodes,
      };

      return returnObject;
    },

    // OLD STUFF
    listSize(_parent, args: { filter: string }) {
      let filteredGames = games.filter(filterCheck(args.filter));
      const returnedCount = { gameCount: filteredGames.length };
      return returnedCount;
    },
    games(_parent, args: { cursor: string; limit: number; sort: string; filter: string }) {
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
      return filteredGames.slice(from, limit);
    },

    // Return just a single game based on it's title. I haven't really worked
    // on this one yet.
    game(_parent, args: { title: string }) {
      return games.find((game) => game.title === args.title) ?? null;
    },
  },
};
