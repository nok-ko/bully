import {JSX} from "react";
import {varNames} from "../table/tableFns.ts";
import * as React from "react";

type TruthTableHeaderParams = {
	baseVariableCount: number,
	extraCols: string[],
	inputExpr: string,
	onChange: React.ChangeEventHandler<HTMLInputElement>,
	onNewCol: () => void,
};

export function TruthTableHeader(props: TruthTableHeaderParams): JSX.Element {
	if (props.baseVariableCount > varNames.length) {
		throw new Error(`Cannot display ${props.baseVariableCount} base variables in header!`);
	}

	const colCount = props.baseVariableCount + props.extraCols.length;

	return <thead>
	<tr>
		{varNames.slice(0,props.baseVariableCount).map(varName => <td key={varName}>{varName}</td>)}
		{props.extraCols.map((colName, index) => <td key={index}>{colName}</td>)}
		<td><input value={props.inputExpr} onChange={props.onChange} onKeyDown={
			(event) => {
				switch (event.code) {
					case 'Tab':
					case 'Enter':
						props.onNewCol()
				}
			}
		}/></td>
	</tr>
	</thead>;
}