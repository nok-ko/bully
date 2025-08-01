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

	const [inputExpr, setInputExpr] = useState<string>('false');
	const [columnExprs, setColumnExprs] = useState<string[]>([]);

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

	function generateRows(base: Table, extraCols: Table[]): Table {
		debugger;
		if (!extraCols.length) return base;
		if (extraCols.length === 1) {
			return augmentTable(
				base,
				extraCols[0],
			)
		}

		return augmentTable(
			generateRows(
				base,
				extraCols.slice(0,-1)
			),
			extraCols.at(-1),
		)
	}

	// function generateRows(): Table {
	// 	return augmentTable(
	// 		augmentTable(
	// 			referenceTable,
	// 			// Extra columns
	// 			exprColumn(columnExprs[0], referenceTable),
	// 		),
	// 		// input
	// 		exprColumn(inputExpr, referenceTable),
	// 	)
	// }

	function onNewCol() {
		setColumnExprs(existing => existing.concat(inputExpr));
		setInputExpr('');
	}

	return <table>
		<TruthTableHeader
			baseVariableCount={baseVariableCount}
			onChange={(event) => setInputExpr(event.target.value)}
			onNewCol={onNewCol}
			inputExpr={inputExpr}
			extraCols={columnExprs}
		/>
		<TruthTableBody rows={
			augmentTable(
				generateRows(referenceTable, columnExprs.map((expr) => exprColumn(expr, referenceTable))),
				exprColumn(inputExpr,referenceTable)
			)
		}/>
	</table>

}