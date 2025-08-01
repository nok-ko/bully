import {expect, describe, it} from "vitest";
import {generateReferenceTable} from "./tableFns.ts";

describe('Generating a reference truth table', () => {
	it('should generate a 2x2 table', () => {
		const table = generateReferenceTable(2);
		expect(table).toEqual([
			[false,false],
			[false,true],
			[true,false],
			[true,true],
		]);
	})
})