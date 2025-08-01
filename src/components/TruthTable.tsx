import {TruthTableHeader} from "./TruthTableHeader.tsx";
import './TruthTable.less';
import TruthTableBody from "./TruthTableBody.tsx";

type VariableIdentifier = 'A' | 'B' | 'C' | 'D';

type TruthTableData = {
	variableList: VariableIdentifier[]
	expressionList: string[];
	expressionInput: string;
};

export default function TruthTable(_props: {}) {
	return <table>
		<TruthTableHeader/>
		<TruthTableBody rows={[[false, false, false, true]]}/>
	</table>

}