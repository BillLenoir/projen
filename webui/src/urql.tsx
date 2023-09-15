import {
  Client,
  Provider,
  cacheExchange,
  fetchExchange,
  gql,
  useQuery,
} from "urql";

interface GamesGraphQLProps {
  page: number;
}

interface GamesProps {
  from: number;
  limit: number;
  sort: string;
  filter: string;
}

const client = new Client({
  url: "http://localhost:4000/",
  exchanges: [cacheExchange, fetchExchange],
});

export default function GamesGraphQL(props: GamesGraphQLProps) {
  return (
    <Provider value={client}>
      <Games from={props.page} limit={50} sort="title" filter="want" />
    </Provider>
  );
}

const Games = (props: GamesProps) => {
  const from = props.from;
  const limit = props.limit;
  const sort = props.sort;
  const filter = props.filter;

  const GamesQuery = gql`
    query ($from: Int!, $limit: Int!, $sort: String!, $filter: String!) {
      games(from: $from, limit: $limit, sort: $sort, filter: $filter) {
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

  const [result, reexecuteQuery] = useQuery({
    query: GamesQuery,
    variables: { from, limit, sort, filter },
  });

  const { data, fetching, error } = result;
  console.log(reexecuteQuery);

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

  return <tbody>{tableRow}</tbody>;
};
