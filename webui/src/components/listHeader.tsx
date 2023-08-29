interface ListHeaderProps {
  text: string;
}

export default function ListHeader(props: ListHeaderProps) {
  return <h2 id="listDescription">{props.text}</h2>;
}
