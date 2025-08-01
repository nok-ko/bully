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


type VariableBindings = Record<string, boolean>;

export function rowToBindings(row: boolean[]): VariableBindings {
	return Object.fromEntries(
		row.map(
			(value, index) => [varNames[index], value]
		)
	)
}

function evalNode(node: Parser.Node, bindings: VariableBindings): boolean {
	if ('var' in node) {
		return bindings[node.var]
	} else if ('val' in node) {
		return node.val
	} else if ('op' in node) {
		switch (node.op) {
			case 'and':
				return evalNode(node.left, bindings) && evalNode(node.right, bindings)
			case 'or':
				return evalNode(node.left, bindings) || evalNode(node.right, bindings)
			case 'not':
				return !evalNode(node.invertend, bindings)
		}
	}
	// Can you even get here with correct inputs?
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
		// Convert the input row into a nicer form, like:
		// {A: true, B: false}, etc.
		const bindings = rowToBindings(row);
		const tree: Parser.Node = parse(expression, { /* tracer */ }) as Parser.Node;
		return evalNode(tree, bindings);
	} catch (e) {
		// console.log(tracer.getBacktraceString())
		throw e;
	}
}


