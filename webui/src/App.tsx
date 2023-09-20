import "./App.css";
import { useState } from "react";
// import GameItem from "./components/gameItem";
import ListHeader from "./components/listHeader";
import Pagination from "./components/pagination";
import { games } from "./data/gameData";
import GamesGraphQL from "./urql";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(games.length / 50);

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
    <div>
      <ListHeader text="Sorted alphabetically by title" />
      <Pagination
        location="top"
        pageButtonClick={handlePageButtonClick}
        currentPage={currentPage}
        maxPage={maxPage}
      />
      <table cellSpacing="0" cellPadding="0" id="gameDataTable">
        <GamesGraphQL />
      </table>
      <Pagination
        location="bottom"
        pageButtonClick={handlePageButtonClick}
        currentPage={currentPage}
        maxPage={maxPage}
      />
    </div>
  );
}
