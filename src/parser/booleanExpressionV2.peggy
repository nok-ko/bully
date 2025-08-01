// Global helpers
{{
  const makeGetTerms = (opType) => (node) => {
    if (node.op === opType) {
      return node.operands
    } else {
      return [node]
    }
  }
	
  const getOrTerms = makeGetTerms('or');
  const getAndTerms = makeGetTerms('and');
  
  
  const simplicityOrder = ["boolean", "string", "object"];
  const bySimplicity = (a,b) => {
      if (typeof a === typeof b) {
        return b < a
      }
      return simplicityOrder.indexOf(typeof a) - simplicityOrder.indexOf(typeof b);
  }
}}

// Per-parse instruction.
// This block runs before each parse.
{
  // Strip whitespace from the input:
  input = input.replace(/ /g,'')
}

// Root expression, starts parsing:
start
  = lines:(sum|2..,"\n"|) {return Object.fromEntries(lines.map((line,i) => [i,line]))}
  / sum
  / "" {return {val: false}}

// Terms compose into products compose into sums.

// At the top level, look for sums, then bare product expressions:
sum
  // Look for "+"-delimited products:
  // Need to match at least 2 so that a single term doesn't output an OR node.
  = products:( product|2.., "+"| ) {
    return {op: 'or', operands: [...(products.flatMap(getOrTerms))]}; 
  }
  / product

// Products can be written either with an asterisk or implicitly by mashing two
// terms together
product
  = terms:( term|2.., "*"?| ) {
    // Flatten AND expressions, allowed by the law of associativity:
    // (AB)B = ABB = A(BB)
    let operands = terms.flatMap(getAndTerms)
    // Re-order terms for stability and faster evaluation. 
    // Allowed by the law of commutativity:
    // BBA = ABB = BAB
    operands = operands.sort(bySimplicity)
    
    let node = {op: 'and', operands}
    
    // Simplify AND expressions by the law of complementarity,
    // (A + A') = false
    
    // Gather all value terms:
    const simpleTerms = node.operands.filter(
      child => typeof child === 'string' || typeof child === 'boolean'
    )
    // Gather all not(value) terms:
    const notTerms = node.operands.filter(child => child?.op === 'not')
    // If any notTerm inverts a value term, the product must be false.
    if (notTerms.some(not => simpleTerms.includes(not?.invertend))) {
      return false;
    }
    // Return the operation node:
    return {op: 'and', operands}; 
  }
  / term:term

// A term is either:
term
  // A value with any number of NOTs after it:
  = invertend:value nots:"'"+ {
    // Don't invert double-inverted (even-NOT-count) values.
    const shouldInvert = nots.length % 2 == 1;
    // Implicitly invert constant values:
    if (typeof invertend === 'boolean' && shouldInvert) {
      return !invertend
    }
    return (
      nots.length % 2 == 1 
        ? {op: 'not', invertend} 
        : invertend
      )
  }
  // A sum with any number of NOTs after it:
  / "(" inverted_sum:sum ")" nots:"'"+ {
    return (nots.length % 2 == 1 ? {op: 'not', invertend: inverted_sum} : inverted_sum)
  }
  // A sum in parentheses:
  / "(" sum:sum ")" { return sum; }
  // A bare value:
  / value


/// Bottom types:

// A value is:
value
  // A literal:
  = literal
  // A variable:
  / variable

literal
  // A literal `false`
  = "false" { return false }
  // A literal `true`
  / "true" { return true }

// A variable is:
variable "variable"
  // Just a single uppercase letter:
  = name:[A-Z] { return name; }

