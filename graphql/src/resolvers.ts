import { games } from './data/collectionData.js';
import { Filter, Game, Resolvers, Sort } from './resolvers-types.js';

// This checks each game to see if it passes the filter check
// based on the games relationship to Billy's collection.
export const filterCheck = (filter: string) => {
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

const getEncodedCursor = (
  cursorId: number | null,
  cursorLimit: number,
  cursorSort: Sort,
  cursorFilter: Filter,
) => {
  let rawCursor = '{ ';
  if (cursorId !== null) {
    rawCursor += `"i": ${cursorId}, `;
  }
  rawCursor += `"l": ${cursorLimit}, "s": "${cursorSort}", "f": "${cursorFilter}" } `;
  const encodedCursor = btoa(rawCursor);
  return encodedCursor;
};

export const resolvers: Resolvers = {
  Query: {
    findGames(_parent, args: { cursor: string }) {

      // Parsing the arguments
      const input = JSON.parse(atob(args.cursor));

      // Filtering the list of games
      let filteredGames = games.filter(filterCheck(input.f));

      // Sorting the list of games
      // Sort by ID
      if (input.s === Sort.Id) { // This sorts the filtered games by ID.
        filteredGames.sort((a, b) => a.id - b.id);
      // Sort by title
      } else if (input.s === Sort.Title) { // This sorts the filtered games by title made uppercase.
        filteredGames.sort((a, b) => {
          const gameA = a.title?.toUpperCase() ?? '';
          const gameB = b.title?.toUpperCase() ?? '';
          if (gameA < gameB) {
            return -1;
          }
          if (gameA > gameB) {
            return 1;
          }
          return 0;
        });
      // Sort by year published
      } else if (input.s === Sort.Yearpublished) { // Sorts the games by year published.
        filteredGames.sort((a, b) => (a.yearpublished ?? 0) - (b.yearpublished ?? 0));
      // Should be one of the previous three sort types
      } else {
        throw new Error('Something wrong with selected sort');
      }

      // Get the requested number o games, starting at the cursor's location
      let from: number = 0;
      let to: number = 0;
      let cursorGame: Game | null = null;
      let limit: number = input.l;
      // If a game's ID has been included, see if it is in the
      // filtered and sorted list.
      if (input.i !== null) {
        cursorGame = filteredGames.find((game) => game.id === input.i) ?? null;
      }
      // If we found the identified game, we start the returned list at that point
      if (cursorGame != null) {
        from = filteredGames.indexOf(cursorGame);
      }

      // Check to see how many games remain on the list after the identified game
      // Cannot return more games than remain on the list!
      if (from + limit <= filteredGames.length - 1) {
        to = from + limit;
      } else {
        to = filteredGames.length;
      }

      // Assemble the requested game info
      const returnedGames = filteredGames.slice(from, to);

      // Need to gather the varous cursors we will be returning
      let firstCursor: string | null = null;
      let prevCursor: string | null = null;
      let nextCursor: string | null = null;
      let lastCursor: string | null = null;

      // The first "page"
      if (from >= (limit * 2)) {
        firstCursor = getEncodedCursor(null, input.l, input.s, input.f);
      }

      // The previous "page"
      if (from >= limit) {
        prevCursor = getEncodedCursor(filteredGames[from - limit].id, input.l, input.s, input.f);
      }

      // The next "page"
      if (from <= filteredGames.length - limit - 1) {
        nextCursor = getEncodedCursor(filteredGames[from + limit].id, input.l, input.s, input.f);
      }

      // The last "page"
      if (from <= filteredGames.length - (limit * 2) - 1) {
        lastCursor = getEncodedCursor(filteredGames[filteredGames.length - limit].id, input.l, input.s, input.f);
      }

      // Assemble data for each returned game
      const gameNodes = [];
      let gameCursor;
      let returnedGameNode;
      for (let i = 0; i < returnedGames.length; i++) {
        gameCursor = getEncodedCursor(returnedGames[i].id, input.l, input.s, input.f);
        returnedGameNode = { cursor: gameCursor, game: returnedGames[i] };
        gameNodes.push(returnedGameNode);
      }

      // Assemble the whole payload
      let returnObject = {
        totalCount: filteredGames.length,
        gameNumber: from,
        firstCursor: firstCursor,
        prevCursor: prevCursor,
        nextCursor: nextCursor,
        lastCursor: lastCursor,
        games: gameNodes,
      };

      return returnObject;
    },

    // Return just a single game based on it's title. I haven't really worked
    // on this one yet.
    game(_parent, args: { title: string }) {
      return games.find((game) => game.title === args.title) ?? null;
    },
  },
};
