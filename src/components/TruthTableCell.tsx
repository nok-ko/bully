export function TruthTableCell(props: { bool: boolean }) {
	return <td className={props.bool ? "true" : ""}>{props.bool ? 1 : 0}</td>;
}