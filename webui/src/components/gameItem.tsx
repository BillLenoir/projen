import { games } from "../data/gameData";

interface GameItemProps {
  page: number | undefined;
}

export default function GameItem(props: GameItemProps) {
  let tableRow = [];

  const from: number = props.page ? (props.page - 1) * 50 : 0;
  let to: number = props.page ? props.page * 50 - 1 : 50;
  if (to > games.length) {
    to = games.length - 1;
  }
  const bggBaseURL = "https://boardgamegeek.com/boardgame/";

  for (let i = from; i <= to; i++) {
    let gameImage;
    if (games[i].thumbnail) {
      gameImage = (
        <td>
          <img
            src={games[i].thumbnail}
            alt={"Cover image for" + games[i].title}
          />
        </td>
      );
    } else {
      gameImage = <td className="noImage">No Image</td>;
    }
    const gamePublisher = games[i].publisher.split("xxxxx").join(", ");
    const gameDescription = games[i].description ? games[i].description : "";
    const gameURL = bggBaseURL + games[i].id;
    const gameTitle = games[i].title;
    const gameYearPublished = games[i].yearpublished
      ? games[i].yearpublished
      : "";

    tableRow.push(
      <tr key={games[i].id}>
        {gameImage}
        <td>
          <h3>
            <a href={gameURL}>{gameTitle}</a> &mdash; {gameYearPublished}
          </h3>
          <p>{gameDescription}</p>
        </td>
        <td className="people">
          <p>{gamePublisher}</p>
        </td>
      </tr>,
    );
  }

  return <tbody>{tableRow}</tbody>;
}
