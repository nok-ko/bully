import {JSX} from "react";
import {TruthTableRow} from "./TruthTableRow.tsx";

export type TruthTableBodyProps = {
	rows: boolean[][]
}

export default function TruthTableBody(props: TruthTableBodyProps): JSX.Element {
	const {rows} = props;
	return (
	<tbody id="vars">
		{rows.map((boolRow,index) => <TruthTableRow key={index} values={boolRow}/>)}
	</tbody>
	)
}