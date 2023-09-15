interface PageButtonProps {
  location: string | undefined;
  whichPage: string;
  handlePageButtonClick: (whichPage: string) => void;
  currentPage: number;
  maxPage: number;
}

export default function PageButtons(props: PageButtonProps) {
  let buttonText: string;
  const whichPage = props.whichPage;
  const classname = whichPage + " pageButton";
  const location = props.location + whichPage;
  const currentPage = props.currentPage;
  const maxPage = props.maxPage;

  const toggleDisable = (): boolean => {
    if (whichPage === "First") {
      return currentPage <= 2;
    } else if (whichPage === "Prev") {
      return currentPage === 1;
    } else if (whichPage === "Next") {
      return currentPage === maxPage;
    } else if (whichPage === "Last") {
      return currentPage >= maxPage - 1;
    } else {
      throw new Error("Which page wasn't properly defined");
    }
  };

  switch (whichPage) {
    case "First":
      buttonText = "<<";
      break;
    case "Prev":
      buttonText = "<";
      break;
    case "Next":
      buttonText = ">";
      break;
    case "Last":
      buttonText = ">>";
      break;
    default:
      throw new Error("The location property is not defined!");
  }

  return (
    <button
      type="button"
      id={location}
      className={classname}
      onClick={() => props.handlePageButtonClick(whichPage)}
      disabled={toggleDisable()}
    >
      {buttonText}
    </button>
  );
}
