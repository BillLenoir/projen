import PageButtons from "./pageButtons";

interface PaginationProps {
  location: string | undefined;
  handlePageButtonClick: (newCursor: string) => void;
  first: string | null;
  prev: string | null;
  next: string | null;
  last: string | null;
  totalCount: number;
  from: number;
  to: number;
}

export default function Pagination(props: PaginationProps) {
  const classes = `pagination ${props.location}`;
  const location = props.location;
  const handlePageButtonClick = props.handlePageButtonClick;
  const whereAmI = `Games ${props.from} through ${props.to} of ${props.totalCount}`;
  return (
    <div className={classes}>
      <PageButtons
        location={location}
        handlePageButtonClick={handlePageButtonClick}
        cursor={props.first}
        buttonText="<<"
      />
      <PageButtons
        location={location}
        handlePageButtonClick={handlePageButtonClick}
        cursor={props.prev}
        buttonText="<"
      />
      <span className="gameCount">{whereAmI}</span>
      <PageButtons
        location={location}
        handlePageButtonClick={handlePageButtonClick}
        cursor={props.next}
        buttonText=">"
      />
      <PageButtons
        location={location}
        handlePageButtonClick={handlePageButtonClick}
        cursor={props.last}
        buttonText=">>"
      />
    </div>
  );
}
