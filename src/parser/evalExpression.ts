import {parse} from '../../lib/booleanExpressionParser';
import {varNames} from "../table/tableFns.ts";
// import Tracer from 'pegjs-backtrace';

// evalExpr(expr: string, row: bool[]): bool[] //(column) | EvalFailure

type EvalFailure = null;

export namespace Parser {
	export type Node
		= Value
	  | AndOp
		| OrOp
		| InvertOp

	export type InvertOp = {op: 'not', invertend: Node}
	export type AndOp = {op: 'and', left: Value, right: Node}
	export type OrOp = {op: 'or', left: Value, right: Node}

	export type Value = Literal | Var
	export type Literal = {val: boolean}
	export type Var = {var: string}
}


/**
 * An object binding Boolean values to variable names.
 */
type VariableBindings = Record<string, boolean>;

/**
 * Zip a row of boolean values together with the canonical list of variable
 * names A-Z.
 *
 * @param row
 * A row of Boolean values. Only the first 26 values are used, a warning is
 * logged to the console if more are supplied.
 *
 * @return {VariableBindings}
 * An object with variable name keys and values taken from the row, in
 * alphabetical order.
 */
export function rowToBindings(row: boolean[]): VariableBindings {
	const lengthLimit = varNames.length;
	if (row.length > lengthLimit) {
		console.group('rowToBindings: Input row too big!')
		console.warn(
			`Got ${row.length} input values - cannot map them to the ${lengthLimit} `
		+ `available variable names.`
		);
		console.warn(`Trimming away ${row.length - lengthLimit} value(s)!`);
		console.groupEnd();
		row = row.slice(0, lengthLimit);
	}

	return Object.fromEntries(
		row.map(
			(value, index) => [varNames[index], value]
		)
	)
}

/**
 * Recursively evaluate a parse tree, given the specified variable bindings.
 *
 * @param node
 * @param bindings
 */
export function evaluateTree(node: Parser.Node, bindings: VariableBindings): boolean {
	// Base case: handle the bottom types:
	if ('var' in node) {
		/** @var {Parser.Var} node */
		return bindings[ node['var'] ]
	} else if ('val' in node) {
		/** @var {Parser.Value} node */
		return node.val
	}

	// Handle the operation nodes:
	if ('op' in node) {
		switch (node.op) {
			case 'and':
				/** @var {Parser.AndOp} node */
				return evaluateTree(node.left, bindings) && evaluateTree(node.right, bindings)
			case 'or':
				/** @var {Parser.OrOp} node */
				return evaluateTree(node.left, bindings) || evaluateTree(node.right, bindings)
			case 'not':
				/** @var {Parser.InvertOp} node */
				return !evaluateTree(node.invertend, bindings)
		}
	}
	// Can you even get here with correct inputs? TODO: fix?
	return true;
}

/**
 * Run a user-supplied expression on a row of input values.
 * Return the result, or throw an error if the expression could not be parsed.
 * @param expression
 * @param row
 * A row of values. The first value is the value of the variable "A", then "B"
 * and so on.
 */
export function evalExpression(expression: string, row: boolean[]): boolean | EvalFailure {
	// const tracer = new Tracer(expression, {showTrace: false, showFullPath: false});
	try {
		const tree: Parser.Node = parse(expression, { /* tracer */ }) as Parser.Node;
		return evaluateTree(
			tree,
			// We have to convert the input row into an object defining the variable
			// bindings, {A: true, B: false}, etc:
			rowToBindings(row)
		);
	} catch (e) {
		// console.log(tracer.getBacktraceString())
		throw e;
	}
}


