// 1. Variables
// 1.5. (bonus points - literals)
// 2. OR (+)
// 3. AND {var}{var}
// 4. unary not {var}'
// 5. parens

// sum - {product} + {product}
// product - AB, A'B'C'
// (AB + C)'


start
  = sum
  / '' { return {} }

sum
  = left:product "+" right:sum { return {op: 'or', left, right}; }
  / product

product
  = left:primary "*" right:product { return {op: 'and', left, right}; }
  / left:primary right:product {return {op: 'and', left, right};}
  / primary

primary
  = invertend:value nots:"'"+ {
    return (nots.length % 2 == 1 ? {op: 'not', invertend} : invertend)
  }
  / value
  / "(" inverted_sum:sum ")" nots:"'"+ {
    return (nots.length % 2 == 1 ? {op: 'not', invertend: inverted_sum} : inverted_sum)
  }
  / "(" sum:sum ")" { return sum; }

value
  = "true" { return {val: true} }
  / "false" { return {val: false} }
  / variable


variable "variable binding"
  = name:[A-Z] { return {var: name}; }