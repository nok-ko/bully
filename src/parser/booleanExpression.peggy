// Per-parse instruction.
// This block runs before each parse.
{
  // Strip whitespace from the input:
  input = input.replace(/\s/g,'')
}

// Root expression, starts parsing:
start
  = sum
  / '' { return {} }

// At the top level, look for sums, then bare product expressions:
sum
  = left:product "+" right:sum { return {op: 'or', left, right}; }
  / product

// Products can be written either with an asterisk or implicitly by mashing two
// terms together
product
  = left:term "*" right:product { return {op: 'and', left, right}; }
  / left:term right:product {return {op: 'and', left, right};}
  / term

// A term is either:
term
  // A value with any number of NOTs after it:
  = invertend:value nots:"'"+ {
    return (nots.length % 2 == 1 ? {op: 'not', invertend} : invertend)
  }
  // A bare value:
  / value
  // A sum with any number of NOTs after it:
  / "(" inverted_sum:sum ")" nots:"'"+ {
    return (nots.length % 2 == 1 ? {op: 'not', invertend: inverted_sum} : inverted_sum)
  }
  // A sum in parentheses:
  / "(" sum:sum ")" { return sum; }


/// Bottom types:

// A value is:
value
  // A literal:
  = literal
  // A variable binding:
  / variable

literal
  // A literal `false`
  = "false" { return {val: false} }
  // A literal `true`
  / "true" { return {val: true} }

// A variable is:
variable "variable"
  // Just a single uppercase letter:
  = name:[A-Z] { return {"var": name}; }