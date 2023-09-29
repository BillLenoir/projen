import "./App.css";
import { useState, useEffect } from "react";
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
  limit: number;
  sort: Sort;
  filter: Filter;
}

let firstDisabled = true;
let prevDisabled = true;
let nextDisabled = false;
let lastDisabled = false;
let maxPage: number = 0;
let sort: Sort = Sort.ID;
let filter: Filter = Filter.OWN;
let cursor: string = "";
let limit: number = 50;

const client = new Client({
  url: "http://localhost:4000/",
  exchanges: [cacheExchange, fetchExchange],
});

const GamesQuery = gql`
  query FindGames(
    $sort: Sort!
    $filter: Filter!
    $cursor: String!
    $limit: Int!
  ) {
    findGames(sort: $sort, filter: $filter, cursor: $cursor, limit: $limit) {
      totalCount
      hasNextPage
      endCursor
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

const sendGamesQuery = () => {
  const [result, _reexecuteQuery] = useQuery({
    query: GamesQuery,
    variables: { cursor, limit, sort, filter },
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

  maxPage = Math.ceil(data.findGames.totalCount / limit);
  cursor = data.findGames.endCursor;
  let gamesToDisplay = [];
  const bggBaseURL = "https://boardgamegeek.com/boardgame/";

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

export default function App() {
  return (
    <Provider value={client}>
      <Games cursor="" limit={10} sort={Sort.ID} filter={Filter.OWN} />
    </Provider>
  );
}

const Games = (props: GamesProps) => {
  sort = props.sort;
  filter = props.filter;
  cursor = props.cursor;
  limit = props.limit;
  let tableRows = sendGamesQuery();

  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (currentPage === 1) {
      firstDisabled = true;
      prevDisabled = true;
      nextDisabled = false;
      lastDisabled = false;
    } else if (currentPage === 2) {
      firstDisabled = true;
      prevDisabled = false;
      nextDisabled = false;
      lastDisabled = false;
    } else if (currentPage === maxPage - 1) {
      firstDisabled = false;
      prevDisabled = false;
      nextDisabled = false;
      lastDisabled = true;
    } else if (currentPage === maxPage) {
      firstDisabled = false;
      prevDisabled = false;
      nextDisabled = true;
      lastDisabled = true;
    } else {
      firstDisabled = false;
      prevDisabled = false;
      nextDisabled = false;
      lastDisabled = false;
    }
  }, [currentPage]);

  function handlePageButtonClick(whichPage: string): void {
    switch (whichPage) {
      case "First":
        setCurrentPage(1);
        break;
      case "Prev":
        setCurrentPage(currentPage - 1);
        break;
      case "Next":
        setCurrentPage(currentPage + 1);
        break;
      case "Last":
        setCurrentPage(maxPage);
        break;
      default:
        throw new Error("Which Page was not properly set.");
    }
  }

  return (
    <Provider value={client}>
      <div>
        <ListHeader text="Sorted alphabetically by title" />
        <Pagination
          location="top"
          pageButtonClick={handlePageButtonClick}
          firstDisabled={firstDisabled}
          prevDisabled={prevDisabled}
          nextDisabled={nextDisabled}
          lastDisabled={lastDisabled}
          currentPage={currentPage}
          maxPage={maxPage}
        />
        <table cellSpacing="0" cellPadding="0" id="gameDataTable">
          <tbody>{tableRows}</tbody>
        </table>
        <Pagination
          location="bottom"
          pageButtonClick={handlePageButtonClick}
          firstDisabled={firstDisabled}
          prevDisabled={prevDisabled}
          nextDisabled={nextDisabled}
          lastDisabled={lastDisabled}
          currentPage={currentPage}
          maxPage={maxPage}
        />
      </div>
    </Provider>
  );
};
