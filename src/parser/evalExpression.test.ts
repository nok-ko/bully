import {expect, describe, it} from "vitest";
import {parse} from '../../lib/booleanExpressionParser';
import {augmentTable, generateReferenceTable} from "./tableFns.ts";
import {evalExpression, Parser, rowToBindings} from "./evalExpression.ts";

describe('Boolean Expression Parsing', () => {
	describe('supports bottom types', () => {
		it('by outputting literals', () => {
			const justTrue = parse('true', {}) as Parser.Node
			expect(justTrue).toEqual({
				val: true
			});
			const justFalse = parse('false', {}) as Parser.Node
			expect(justFalse).toEqual({
				val: false
			});
		})
		it('by outputting variable bindings', () => {
			const tree = parse('A', {}) as Parser.Node
			expect(tree).toEqual({
				var: 'A'
			});
		})
	})
	describe('supports Boolean sums', () => {
		it('of two simple terms', () => {
			const simpleSum = parse('A + B', {}) as Parser.Node
			expect(simpleSum).toEqual({
				op: 'or',
				left: {
					var: 'A'
				},
				right: {
					var: 'B'
				}
			});
		})
		it('of two products', () => {
			const tree = parse('AB + CD', {}) as Parser.Node
			expect(tree).toEqual({
				op: 'or',
				left: {
					op: 'and',
					left: {
						var: 'A'
					},
					right: {
						var: 'B'
					}
				},
				right: {
					op: 'and',
					left: {
						var: 'C'
					},
					right: {
						var: 'D'
					}
				}
			});
		})
	})
	describe('supports Boolean products', () => {
		it('of two simple terms', () => {
			const simpleSum = parse('AB', {}) as Parser.Node
			expect(simpleSum).toEqual({
				op: 'and',
				left: {
					var: 'A'
				},
				right: {
					var: 'B'
				}
			});
		})
		it('of a simple term and an inverted term', () => {
			const tree = parse('AB\'', {}) as Parser.Node
			expect(tree).toEqual({
				op: 'and',
				left: {
					var: 'A'
				},
				right: {
					op: 'not',
					invertend: {
						var: 'B'
					}
				}
			});
		})
	})
})

describe('rowToBindings', () => {
	it('Binds just A', () => {
		expect(
			rowToBindings([true, false, false, false])
		).toEqual({
			'A': true,
			'B': false,
			'C': false,
			'D': false,
		})
	})
});

describe('Evaluating a Boolean Expression', () => {
	it('Evaluates literals', () => {
		expect(
			evalExpression('true', [])
		).toBe(true)
		expect(
			evalExpression('false', [])
		).toBe(false)
	})
	it('Evaluates bound variables', () => {
		expect(
			evalExpression('A', [true])
		).toBe(true)
		expect(
			evalExpression('A', [false])
		).toBe(false)
	})
	describe('Evaluates Boolean sums', () => {
		it('of simple terms', () => {
			expect(
				evalExpression('A + B', [true, false])
			).toBe(true)
			expect(
				evalExpression('A + B', [false, false])
			).toBe(false)
		})
		it('of three+ terms', () => {
			expect(
				evalExpression('A + B + C', [true, false, false])
			).toBe(true)
			expect(
				evalExpression(
					'A + B + C + D + E',
					[false, false, false, false, false]
				)
			).toBe(false)
		})
	})

	describe('Evaluates Boolean products', () => {
		it('of simple terms', () => {
			expect(
				evalExpression('AB', [true, false])
			).toBe(false)
			expect(
				evalExpression('AB', [true, true])
			).toBe(true)
		})
		it('of three+ terms', () => {
			expect(
				evalExpression('ABC', [true, false, false])
			).toBe(false)
			expect(
				evalExpression(
					'ABCDE',
					[true, true, true, true, true]
				)
			).toBe(true)
		})
		it('of inverted terms', () => {
			expect(
				evalExpression('AB\'C', [true, false, true])
			).toBe(true)
			expect(
				evalExpression(
					"A'B'C'D'E'",
					[true, true, true, true, true]
				)
			).toBe(false)
		})
	})

	describe('Evaluates Boolean NOT', () => {
		it('of simple terms', () => {
			expect(
				evalExpression('A\'', [true, false])
			).toBe(false)
			expect(
				evalExpression('B\'', [true, false])
			).toBe(true)
		})
		it('of parentheticals', () => {
			expect(
				evalExpression('(ABC)\'', [true, false, false])
			).toBe(true)
			expect(
				evalExpression(
					'(ABCDE)\'',
					[true, true, true, true, true]
				)
			).toBe(false)
		})
	})

});
