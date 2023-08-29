interface PageButtonProps {
  location: string | undefined;
  whichPage: string;
  handlePageButtonClick: (whichPage: string) => void;
  disabled: boolean;
}

export default function PageButtons(props: PageButtonProps) {
  let buttonText: string;
  let classname: string;
  let whichPage = props.whichPage;
  let location = props.location;
  switch (props.whichPage) {
    case "first":
      buttonText = "<<";
      whichPage = "First";
      break;
    case "prev":
      buttonText = "<";
      whichPage = "Prev";
      break;
    case "next":
      buttonText = ">";
      whichPage = "Next";
      break;
    case "last":
      buttonText = ">>";
      whichPage = "Last";
      break;
    default:
      throw new Error("The location property is not defined!");
  }
  location = location + whichPage;
  classname = whichPage + " pageButton";

  return (
    <button
      type="button"
      id={location}
      className={classname}
      onClick={() => props.handlePageButtonClick(whichPage)}
      disabled={props.disabled}
    >
      {buttonText}
    </button>
  );
}
