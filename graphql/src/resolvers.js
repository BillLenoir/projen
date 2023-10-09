"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = exports.filterCheck = void 0;
var collectionData_js_1 = require("./data/collectionData.js");
var resolvers_types_js_1 = require("./resolvers-types.js");
// This checks each game to see if it passes the filter check
// based on the games relationship to Billy's collection.
var filterCheck = function (filter) {
    var includedGame = function () { return true; };
    if (filter === resolvers_types_js_1.Filter.Own) {
        includedGame = function (game) { return game.gameown === true; };
    }
    else if (filter === resolvers_types_js_1.Filter.Want) {
        includedGame = function (game) { return game.gamewanttobuy === true; };
    }
    else if (filter === resolvers_types_js_1.Filter.Prevown) {
        includedGame = function (game) { return game.gameprevowned === true; };
    }
    else if (filter === resolvers_types_js_1.Filter.Trade) {
        includedGame = function (game) { return game.gamefortrade === true; };
    }
    return includedGame;
};
exports.filterCheck = filterCheck;
var getEncodedCursor = function (cursorId, cursorLimit, cursorSort, cursorFilter) {
    var rawCursor = '{ ';
    if (cursorId !== null) {
        rawCursor += "\"i\": ".concat(cursorId, ", ");
    }
    rawCursor += "\"l\": ".concat(cursorLimit, ", \"s\": \"").concat(cursorSort, "\", \"f\": \"").concat(cursorFilter, "\" } ");
    var encodedCursor = btoa(rawCursor);
    return encodedCursor;
};
exports.resolvers = {
    Query: {
        findGames: function (_parent, args) {
            var _a;
            // Parsing the arguments
            var input = JSON.parse(atob(args.cursor));
            // Filtering the list of games
            var filteredGames = collectionData_js_1.games.filter((0, exports.filterCheck)(input.f));
            // Sorting the list of games
            // Sort by ID
            if (input.s === resolvers_types_js_1.Sort.Id) { // This sorts the filtered games by ID.
                filteredGames.sort(function (a, b) { return a.id - b.id; });
                // Sort by title
            }
            else if (input.s === resolvers_types_js_1.Sort.Title) { // This sorts the filtered games by title made uppercase.
                filteredGames.sort(function (a, b) {
                    var _a, _b, _c, _d;
                    var gameA = (_b = (_a = a.title) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : '';
                    var gameB = (_d = (_c = b.title) === null || _c === void 0 ? void 0 : _c.toUpperCase()) !== null && _d !== void 0 ? _d : '';
                    if (gameA < gameB) {
                        return -1;
                    }
                    if (gameA > gameB) {
                        return 1;
                    }
                    return 0;
                });
                // Sort by year published
            }
            else if (input.s === resolvers_types_js_1.Sort.Yearpublished) { // Sorts the games by year published.
                filteredGames.sort(function (a, b) { var _a, _b; return ((_a = a.yearpublished) !== null && _a !== void 0 ? _a : 0) - ((_b = b.yearpublished) !== null && _b !== void 0 ? _b : 0); });
                // Should be one of the previous three sort types
            }
            else {
                throw new Error('Something wrong with selected sort');
            }
            // Get the requested number o games, starting at the cursor's location
            var from = 0;
            var to = 0;
            var cursorGame = null;
            var limit = input.l;
            // If a game's ID has been included, see if it is in the
            // filtered and sorted list.
            if (input.i !== null) {
                cursorGame = (_a = filteredGames.find(function (game) { return game.id === input.i; })) !== null && _a !== void 0 ? _a : null;
            }
            // If we found the identified game, we start the returned list at that point
            if (cursorGame != null) {
                from = filteredGames.indexOf(cursorGame);
            }
            // Check to see how many games remain on the list after the identified game
            // Cannot return more games than remain on the list!
            if (from + limit <= filteredGames.length - 1) {
                to = from + limit;
            }
            else {
                to = filteredGames.length;
            }
            // Assemble the requested game info
            var returnedGames = filteredGames.slice(from, to);
            // Need to gather the varous cursors we will be returning
            var firstCursor = null;
            var prevCursor = null;
            var nextCursor = null;
            var lastCursor = null;
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
            var gameNodes = [];
            var gameCursor;
            var returnedGameNode;
            for (var i = 0; i < returnedGames.length; i++) {
                gameCursor = getEncodedCursor(returnedGames[i].id, input.l, input.s, input.f);
                returnedGameNode = { cursor: gameCursor, game: returnedGames[i] };
                gameNodes.push(returnedGameNode);
            }
            // Assemble the whole payload
            var returnObject = {
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
        game: function (_parent, args) {
            var _a;
            return (_a = collectionData_js_1.games.find(function (game) { return game.title === args.title; })) !== null && _a !== void 0 ? _a : null;
        },
    },
};
