import PageButtons from "./pageButtons";

interface PaginationProps {
  location: string | undefined;
  pageButtonClick: (whichPage: string) => void;
  firstDisabled: boolean;
  prevDisabled: boolean;
  nextDisabled: boolean;
  lastDisabled: boolean;
  currentPage: number;
  maxPage: number;
}

export default function Pagination(props: PaginationProps) {
  const classes = `pagination ${props.location}`;
  const location = props.location;
  const whereAmI = `Page ${props.currentPage} of ${props.maxPage}`;
  return (
    <div className={classes}>
      <PageButtons
        location={location}
        whichPage="First"
        handlePageButtonClick={props.pageButtonClick}
        currentPage={props.currentPage}
        maxPage={props.maxPage}
      />
      <PageButtons
        location={location}
        whichPage="Prev"
        handlePageButtonClick={props.pageButtonClick}
        currentPage={props.currentPage}
        maxPage={props.maxPage}
      />
      <span className="gameCount">{whereAmI}</span>
      <PageButtons
        location={location}
        whichPage="Next"
        handlePageButtonClick={props.pageButtonClick}
        currentPage={props.currentPage}
        maxPage={props.maxPage}
      />
      <PageButtons
        location={location}
        whichPage="Last"
        handlePageButtonClick={props.pageButtonClick}
        currentPage={props.currentPage}
        maxPage={props.maxPage}
      />
    </div>
  );
}
