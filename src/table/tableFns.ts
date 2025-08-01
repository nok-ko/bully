/**
 * A table of boolean values.
 */
export type Table = boolean[][];

/**
 * Generate a table of size 1x`length` and filled with false values.
 */
export const blankColumn = (length: number): Table => Array(length).fill([false])

/**
 * Generate the "base" truth table, simply listing example values for a number
 * of Boolean variables given by `width`.
 * @param width
 * The number of columns in the output table.
 * The number of rows is given by `2 ** width`.
 */
export function generateReferenceTable(width: number): Table {
	const rowLimit = (2**width);
	if (!Number.isSafeInteger(rowLimit)) {
		console.warn(`Probably a bad idea to generate a ${width}-wide table.`)
	}

	const rows = [] as Table;

	for (let i = 0; i < (2 ** width); i++) {
		// Start working on a row:
		const row = [];
		for (let j = 0, rowInt = i; j < width; j++) {
			// Get the last binary digit of the integer representing the row:
			const lastDigit = Boolean(rowInt % 2);
			// Write to the row:
			row.unshift(lastDigit);
			// Shift right:
			rowInt = rowInt >> 1;
		}
		rows.push(row);
	}
	return rows;
}

/**
 * "Add" two tables that have the same number of rows together, similar
 * to {@link https://en.wikipedia.org/wiki/Augmented_matrix augmenting
 * matrices}.
 *
 * The right table's rows are appended to the left's.
 *
 * @param left
 * @param right
 */
export function augmentTable(left: Table, right: Table): Table {
	if (left.length !== right.length) {
		// uh-oh.
	}

	return left.map(
		(leftRow, index) => [...leftRow, ...right[index]]
	);
}

/**
 * Constant array with the uppercase Latin alphabet, used for variable bindings:
 */
export const varNames: string[]
	// Array of 26 empty slots:
	= new Array(26)
	.fill(1) // Filled with something. (Can be any value, will be overwritten.)
	// Transformed:
	.map(
		// Each element turns into ASCII 65 ('A') plus the index at which it is
		// located in the array:
		(_, index) => String.fromCharCode(65 + index)
	);
