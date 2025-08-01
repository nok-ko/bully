import {TruthTableHeader} from "./TruthTableHeader.tsx";
import './TruthTable.less';
import TruthTableBody from "./TruthTableBody.tsx";
import {augmentTable, generateReferenceTable, Table} from "../table/tableFns.ts";
import {useState} from "react";

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

	function generateRows(): Table {
		return augmentTable(
			referenceTable,
			evaluatedColumn === null
				? blankColumn(2 ** baseVariableCount)
				: evaluatedColumn
		);
	}

	return <table>
		<TruthTableHeader
			baseVariableCount={baseVariableCount}
			onInput={(event) => setInputExpr('foo')}
			inputExpr={inputExpr}
			extraCols={[]}
		/>
		<TruthTableBody rows={generateRows()}/>
	</table>

}