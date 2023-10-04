interface PageButtonProps {
  location: string | undefined;
  handlePageButtonClick: (newCursor: string) => void;
  cursor: string | null;
  buttonText: string;
}

export default function PageButtons(props: PageButtonProps) {
  let buttonText = props.buttonText;
  const handlePageButtonClick = props.handlePageButtonClick;
  let disableButton = false;
  let newCursor = "";

  if (props.cursor === null) {
    disableButton = true;
  } else {
    newCursor = props.cursor;
  }

  return (
    <button
      type="button"
      onClick={() => handlePageButtonClick(newCursor)}
      disabled={disableButton}
    >
      {buttonText}
    </button>
  );
}
