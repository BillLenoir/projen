import PageButtons from "./pageButtons";

interface PaginationProps {
  location: string | undefined;
  pageButtonClick: (whichPage: string) => void;
  firstDisabled: boolean;
  prevDisabled: boolean;
  nextDisabled: boolean;
  lastDisabled: boolean;
}

export default function Pagination(props: PaginationProps) {
  const classes = `pagination ${props.location}`;
  const location = props.location;
  return (
    <div className={classes}>
      <PageButtons
        location={location}
        whichPage="first"
        handlePageButtonClick={props.pageButtonClick}
        disabled={props.firstDisabled}
      />
      <PageButtons
        location={location}
        whichPage="prev"
        handlePageButtonClick={props.pageButtonClick}
        disabled={props.prevDisabled}
      />
      <span className="gameCount"></span>
      <PageButtons
        location={location}
        whichPage="next"
        handlePageButtonClick={props.pageButtonClick}
        disabled={props.nextDisabled}
      />
      <PageButtons
        location={location}
        whichPage="last"
        handlePageButtonClick={props.pageButtonClick}
        disabled={props.lastDisabled}
      />
    </div>
  );
}
