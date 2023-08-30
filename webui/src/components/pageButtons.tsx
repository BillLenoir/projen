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

  const toggleDisable = () => {
    let disableSetting = false;
    if (whichPage === "First") {
      if (currentPage <= 2) {
        disableSetting = true;
      } else {
        disableSetting = false;
      }
    } else if (whichPage === "Prev") {
      if (currentPage === 1) {
        disableSetting = true;
      } else {
        disableSetting = false;
      }
    } else if (whichPage === "Next") {
      if (currentPage === maxPage) {
        disableSetting = true;
      } else {
        disableSetting = false;
      }
    } else if (whichPage === "Last") {
      if (currentPage >= maxPage - 1) {
        disableSetting = true;
      } else {
        disableSetting = false;
      }
    } else {
      throw new Error("Which page wasn't properly defined");
    }
    if (typeof disableSetting === "boolean") {
      return disableSetting satisfies boolean;
    } else {
      return undefined;
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
