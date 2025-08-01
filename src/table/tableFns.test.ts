import {expect, describe, it} from "vitest";
import {augmentTable, generateReferenceTable} from "./tableFns.ts";

describe('Utility Functions', () => {
	describe('Reference truth table generation', () => {
		it('should handle a 2x2 table', () => {
			const table = generateReferenceTable(2);
			expect(table, 'should equal the reference').toEqual([
				[false,false],
				[false,true],
				[true,false],
				[true,true],
			]);
		});

		it('should handle a 3x3 table', () => {
			const table = generateReferenceTable(3);
			expect(table, 'should equal the reference').toEqual([
				[false,false,false],
				[false,false,true],
				[false,true,false],
				[false,true,true],
				[true,false,false],
				[true,false,true],
				[true,true,false],
				[true,true,true],
			]);
		})
	})

	describe('Adding two tables together', () => {
		it('should handle adding a single column', () => {
			const table = generateReferenceTable(2);
			const allFalse = Array(4).fill([false]) as boolean[][];
			const augmentedTable = augmentTable(table, allFalse);

			expect(augmentedTable, 'should equal the 2x2 table with a column added').toEqual([
				[false,false,false],
				[false,true,false],
				[true,false,false],
				[true,true,false],
			]);

		})
	})
})