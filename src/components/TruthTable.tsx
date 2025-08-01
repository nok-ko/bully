import {TruthTableHeader} from "./TruthTableHeader.tsx";
import './TruthTable.less';
import TruthTableBody from "./TruthTableBody.tsx";
import {augmentTable, generateReferenceTable, Table} from "../table/tableFns.ts";
import {useState} from "react";
import {evalExpression} from "../parser/evalExpression.ts";

type VariableIdentifier = 'A' | 'B' | 'C' | 'D';

type TruthTableData = {
	variableList: VariableIdentifier[]
	expressionList: string[];
	expressionInput: string;
};

export default function TruthTable({width}: { width: number }) {

	const [inputExpr, setInputExpr] = useState<string>('');

	const evaluatedColumn: null | Table = null;

	const referenceTable = generateReferenceTable(width);

	let baseVariableCount: number = referenceTable[0].length;

	const blankColumn = (length) => Array(length).fill([false])

	function exprColumn(expression: string, bindingTable: Table): Table {
		try {
			return bindingTable.map(
				(row) => [evalExpression(expression,row)]
			)
		} catch (e) {
			return blankColumn(bindingTable.length);
		}
	}

	const evaluated = exprColumn(inputExpr, referenceTable)

	function generateRows(): Table {
		return augmentTable(
			referenceTable,
			// Extra rows
			evaluated,
		);
	}

	return <table>
		<TruthTableHeader
			baseVariableCount={baseVariableCount}
			onChange={(event) => setInputExpr(event.target.value)}
			inputExpr={inputExpr}
			extraCols={[]}
		/>
		<TruthTableBody rows={generateRows()}/>
	</table>

}