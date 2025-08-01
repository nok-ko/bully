export function TruthTableRow(props: { values: boolean[] }) {
	const {values} = props;
	return <tr>
		{values.map((bool, index) => <td key={index} className={bool ? 'true' : ''}>{bool ? 1 : 0}</td>)}
	</tr>;
}