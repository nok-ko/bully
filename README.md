# Bully

Truth tables for the world!

<img width="745" height="654" alt="image" src="https://github.com/user-attachments/assets/1aac644c-4afa-4d2e-a2c0-0989a3022a54" />

## What?

This is **Bully**, my little Boolean expression calculator. I’d made [a similar project](https://github.com/nok-ko/boole) in college while studying for a discrete math final, and decided to port my efforts to a TypeScript and React shell while learning a bit more about parsers. (The old one used a couple of regular expressions and `eval()`. _I know._) 

[Try it on Vercel!](https://booley-bully.vercel.app/)

### Supported Syntax

For more details see the tests and Peggy grammar file, but in short:

- Variables shown in the table (A, B, C, etc.) can be referenced by their names: `D`
- Boolean sums/disjunctions/OR operations are written with `+`: `A + B`
- Literal `true` and `false` are evaluated as you might expect: `true + D`
- Boolean products/conjunctions/AND operations are written with `*` or implicitly: `A * D`, `AD`
- Boolean negation/NOT operations are written with a postfix `'`: `A'D`, `true'`
- Parentheses work as you might expect.
