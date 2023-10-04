import "./App.css";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Client,
  Provider,
  cacheExchange,
  fetchExchange,
  gql,
  useQuery,
} from "urql";

// import GameItem from "./components/gameItem";
import ListHeader from "./components/listHeader";
import Pagination from "./components/pagination";

enum Filter {
  OWN = "OWN",
  WANT = "WANT",
  PREVOWN = "PREVOWN",
  TRADE = "TRADE",
}

enum Sort {
  ID = "ID",
  TITLE = "TITLE",
  YEARPUBLISHED = "YEARPUBLISHED",
}

interface GamesProps {
  cursor: string;
}

let totalCount: number;
let from: number = 1;
let to: number = 50;
let firstCursor: string | null = null;
let prevCursor: string | null = null;
let nextCursor: string | null = null;
let lastCursor: string | null = null;
let limit: number = 50;

const client = new Client({
  url: "http://localhost:4000/",
  exchanges: [cacheExchange, fetchExchange],
});

const GamesQuery = gql`
  query FindGames($cursor: String!) {
    findGames(cursor: $cursor) {
      totalCount
      gameNumber
      firstCursor
      prevCursor
      nextCursor
      lastCursor
      games {
        cursor
        game {
          description
          gamefortrade
          gameown
          gameprevowned
          gamewanttobuy
          id
          publisher
          thumbnail
          title
          yearpublished
        }
      }
    }
  }
`;

const sendGamesQuery = (cursor: string) => {
  const [result, _reexecuteQuery] = useQuery({
    query: GamesQuery,
    variables: { cursor },
  });

  const { data, fetching, error } = result;

  if (fetching)
    return (
      <tr>
        <td>Loading...</td>
      </tr>
    );
  if (error)
    return (
      <tr>
        <td>Oh no... {error.message}</td>
      </tr>
    );

  totalCount = data.findGames.totalCount;
  from = data.findGames.gameNumber + 1;
  to =
    from + limit - 1 <= totalCount
      ? data.findGames.gameNumber + limit
      : totalCount;
  firstCursor = data.findGames.firstCursor;
  prevCursor = data.findGames.prevCursor;
  nextCursor = data.findGames.nextCursor;
  lastCursor = data.findGames.lastCursor;

  let gamesToDisplay = [];
  const bggBaseURL = "https://boardgamegeek.com/boardgame/";
  console.log(data.findGames.games.length);
  for (let i = 0; i < data.findGames.games.length; i++) {
    let gameImage;
    if (data.findGames.games[i].game.thumbnail !== null) {
      gameImage = (
        <td>
          <img
            src={data.findGames.games[i].game.thumbnail}
            alt={"Cover image for" + data.findGames.games[i].game.title}
          />
        </td>
      );
    } else {
      gameImage = <td className="noImage">No image for this game</td>;
    }
    const gamePublisher = data.findGames.games[i].game.publisher
      .split("xxxxx")
      .join(", ");
    const gameDescription = data.findGames.games[i].game.description
      ? data.findGames.games[i].game.description
      : "";
    const gameURL = bggBaseURL + data.findGames.games[i].game.id;
    const gameTitle = data.findGames.games[i].game.title;
    const gameYearPublished = data.findGames.games[i].game.yearpublished
      ? data.findGames.games[i].game.yearpublished
      : "";

    let gameStatusArray: string[] = [];
    if (data.findGames.games[i].game.gameown === true) {
      gameStatusArray.push("OWN");
    }
    if (data.findGames.games[i].game.gamewanttobuy === true) {
      gameStatusArray.push("WANT");
    }
    if (data.findGames.games[i].game.gameprevowned === true) {
      gameStatusArray.push("SOLD");
    }
    if (data.findGames.games[i].game.gamefortrade === true) {
      gameStatusArray.push("FOR SALE");
    }
    const gameStatus = gameStatusArray.join(", ");

    gamesToDisplay.push(
      <tr key={data.findGames.games[i].game.id}>
        {gameImage}
        <td>
          <h3>
            <a href={gameURL}>{gameTitle}</a> &mdash; {gameYearPublished}{" "}
            &mdash; {gameStatus}
          </h3>
          <p>{gameDescription}</p>
        </td>
        <td className="people">
          <p>{gamePublisher}</p>
        </td>
      </tr>,
    );
  }
  return gamesToDisplay;
};

const getEncodedCursor = (
  cursorId: number | null,
  cursorLimit: number,
  cursorSort: string,
  cursorFilter: string,
) => {
  let rawCursor = "{ ";
  if (cursorId !== null) {
    rawCursor += `"i": ${cursorId}, `;
  }
  rawCursor += `"l": ${cursorLimit}, "s": "${cursorSort}", "f": "${cursorFilter}" } `;
  const encodedCursor = btoa(rawCursor);
  return encodedCursor;
};

export default function App() {
  const cursor = getEncodedCursor(null, limit, Sort.ID, Filter.OWN);
  return (
    <BrowserRouter>
      <Provider value={client}>
        <Routes>
          <Route path="/" element={<Games cursor={cursor} />} />
        </Routes>
        <Routes>
          <Route path="/:cursor" element={<Games cursor={cursor} />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

const Games = (props: GamesProps) => {
  let cursor = props.cursor;
  const [current, setCurrent] = useState(cursor);
  function handlePageButtonClick(newCursor: string): void {
    setCurrent(newCursor);
  }
  let tableRows = sendGamesQuery(current);

  return (
    <Provider value={client}>
      <div>
        <ListHeader text="Sorted alphabetically by title" />
        <Pagination
          location="top"
          handlePageButtonClick={handlePageButtonClick}
          first={firstCursor}
          prev={prevCursor}
          next={nextCursor}
          last={lastCursor}
          totalCount={totalCount}
          from={from}
          to={to}
        />
        <table cellSpacing="0" cellPadding="0" id="gameDataTable">
          <tbody>{tableRows}</tbody>
        </table>
        <Pagination
          location="bottom"
          handlePageButtonClick={handlePageButtonClick}
          first={firstCursor}
          prev={prevCursor}
          next={nextCursor}
          last={lastCursor}
          totalCount={totalCount}
          from={from}
          to={to}
        />
      </div>
    </Provider>
  );
};
