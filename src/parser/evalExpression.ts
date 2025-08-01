import {parse} from '../../lib/booleanExpressionParser';
import {varNames} from "../table/tableFns.ts";
import Tracer from 'pegjs-backtrace';

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
}

export function evalExpression(expression: string, row: boolean[]): boolean | EvalFailure {
	const tracer = new Tracer(expression, {showTrace: false, showFullPath: false});
	try {
		const bindings = rowToBindings(row);
		const tree: Parser.Node = parse(expression, {tracer}) as Parser.Node;
		return evalNode(tree, bindings);
	} catch (e) {
		console.log(tracer.getBacktraceString())
		throw e;
	}
}


