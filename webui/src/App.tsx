import "./App.css";
import { useState } from "react";
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
import { games } from "./data/gameData";

interface GamesProps {
  cursor: string;
  limit: number;
  sort: string;
  filter: string;
}

const client = new Client({
  url: "http://localhost:4000/",
  exchanges: [cacheExchange, fetchExchange],
});

export default function App() {
  return (
    <Provider value={client}>
      <Games cursor="" limit={50} sort="title" filter="want" />
    </Provider>
  );
}

const Games = (props: GamesProps) => {
  const cursor = props.cursor;
  const limit = props.limit;
  const sort = props.sort;
  const filter = props.filter;
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(games.length / 50);

  const GamesQuery = gql`
    query ($cursor: String!, $limit: Int!, $sort: String!, $filter: String!) {
      games(cursor: $cursor, limit: $limit, sort: $sort, filter: $filter) {
        description
        id
        publisher
        thumbnail
        title
        yearpublished
        gameown
        gameprevowned
        gamewanttobuy
        gamefortrade
      }
    }
  `;

  const [result, _reexecuteQuery] = useQuery({
    query: GamesQuery,
    variables: { cursor, limit, sort, filter },
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message} </p>;

  let tableRow = [];

  const bggBaseURL = "https://boardgamegeek.com/boardgame/";

  for (let i = 0; i < data.games.length; i++) {
    let gameImage;
    if (data.games[i].thumbnail !== null) {
      gameImage = (
        <td>
          <img
            src={data.games[i].thumbnail}
            alt={"Cover image for" + data.games[i].title}
          />
        </td>
      );
    } else {
      gameImage = <td className="noImage">No image for this game</td>;
    }
    const gamePublisher = data.games[i].publisher.split("xxxxx").join(", ");
    const gameDescription = data.games[i].description
      ? data.games[i].description
      : "";
    const gameURL = bggBaseURL + data.games[i].id;
    const gameTitle = data.games[i].title;
    const gameYearPublished = data.games[i].yearpublished
      ? data.games[i].yearpublished
      : "";

    let gameStatusArray: string[] = [];
    if (data.games[i].gameown === true) {
      gameStatusArray.push("OWN");
    }
    if (data.games[i].gamewanttobuy === true) {
      gameStatusArray.push("WANT");
    }
    if (data.games[i].gameprevowned === true) {
      gameStatusArray.push("SOLD");
    }
    if (data.games[i].gamefortrade === true) {
      gameStatusArray.push("FOR SALE");
    }
    const gameStatus = gameStatusArray.join(", ");

    tableRow.push(
      <tr key={data.games[i].id}>
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
          currentPage={currentPage}
          maxPage={maxPage}
        />
        <table cellSpacing="0" cellPadding="0" id="gameDataTable">
          <tbody>{tableRow}</tbody>
        </table>
        <Pagination
          location="bottom"
          pageButtonClick={handlePageButtonClick}
          currentPage={currentPage}
          maxPage={maxPage}
        />
      </div>
    </Provider>
  );
};
