// generateReferenceTable(width: number)
// evalExpr(expr: string, row: bool[]): bool[] //(column) | EvalFailure
// augmentTables(leftTable: bool[][], rightTable: bool[][]): bool[][]

/**
 * Generate the "base" truth table, simply listing example values for a number
 * of Boolean variables given by `width`.
 * @param width
 * The number of columns in the output table.
 * The number of rows is given by `2 ** width`.
 */
export function generateReferenceTable(width: number): boolean[][] {
	const rowLimit = (2**width);
	let table = [];

	if (!Number.isSafeInteger(rowLimit)) {
		console.warn(`Probably a bad idea to generate a ${width}-wide table.`)
	}

	for (let i = 0, row = [] as boolean[]; i < (2 ** width); i++) {
		// Start working on a row:
		// 0000 [] -> 0000 [0] -> 000 [0]
		for (let j = 0; j < width; j++) {
			const lastDigit = i % 2;

			
		}


	}

}

