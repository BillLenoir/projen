import "./App.css";
import { useEffect, useState } from "react";
import GameItem from "./components/gameItem";
import ListHeader from "./components/listHeader";
import Pagination from "./components/pagination";
import { games } from "./data/gameData";

let firstDisabled = true;
let prevDisabled = true;
let nextDisabled = false;
let lastDisabled = false;

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

  return (
    <div>
      <ListHeader text="Games Bill owns, sorted alphabetically by title." />
      <Pagination
        location="top"
        pageButtonClick={handlePageButtonClick}
        firstDisabled={firstDisabled}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        lastDisabled={lastDisabled}
      />
      <table cellSpacing="0" cellPadding="0" id="gameDataTable">
        <GameItem page={currentPage} />
      </table>
      <Pagination
        location="bottom"
        pageButtonClick={handlePageButtonClick}
        firstDisabled={firstDisabled}
        prevDisabled={prevDisabled}
        nextDisabled={nextDisabled}
        lastDisabled={lastDisabled}
      />
    </div>
  );
}
