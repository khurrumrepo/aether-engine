/**
 * ============================================================================
 * AETHER PROGRAMMING LANGUAGE - ADVANCED LEXER
 * Module: src/compiler/lexer.js
 * Description: Tokenizes control-flow keywords, comparison operators, and blocks.
 * ============================================================================
 */

export class AetherLexer {
    constructor(sourceCode) {
        this.sourceCode = sourceCode;
        this.cursor = 0;
        this.length = sourceCode.length;
        this.line = 1;
        this.column = 1;
    }

    tokenize() {
        const tokens = [];

        while (this.cursor < this.length) {
            let char = this.sourceCode[this.cursor];

            if (char === '\n') {
                this.line++;
                this.column = 1;
                this.cursor++;
                continue;
            }
            if (/\s/.test(char)) {
                this.cursor++;
                this.column++;
                continue;
            }

            // Comments
            if (char === '/' && this.sourceCode[this.cursor + 1] === '/') {
                while (this.cursor < this.length && this.sourceCode[this.cursor] !== '\n') {
                    this.cursor++;
                }
                continue;
            }

            // Identifiers & Keywords
            if (/[a-zA-Z_]/.test(char)) {
                let value = '';
                while (this.cursor < this.length && /[a-zA-Z0-9_]/.test(this.sourceCode[this.cursor])) {
                    value += this.sourceCode[this.cursor];
                    this.cursor++;
                    this.column++;
                }

                const keywords = ['let', 'print', 'if', 'else', 'while', 'fn', 'return', 'mesh', 'stream', 'exec'];
                if (keywords.includes(value)) {
                    tokens.push({ type: 'KEYWORD', value, line: this.line });
                } else {
                    tokens.push({ type: 'IDENTIFIER', value, line: this.line });
                }
                continue;
            }

            // Numbers
            if (/[0-9]/.test(char)) {
                let value = '';
                while (this.cursor < this.length && /[0-9.]/.test(this.sourceCode[this.cursor])) {
                    value += this.sourceCode[this.cursor];
                    this.cursor++;
                    this.column++;
                }
                tokens.push({ type: 'NUMBER', value: Number(value), line: this.line });
                continue;
            }

            // Strings
            if (char === '"') {
                let value = '';
                this.cursor++;
                this.column++;
                while (this.cursor < this.length && this.sourceCode[this.cursor] !== '"') {
                    value += this.sourceCode[this.cursor];
                    this.cursor++;
                    this.column++;
                }
                this.cursor++;
                this.column++;
                tokens.push({ type: 'STRING', value, line: this.line });
                continue;
            }

            // Multi-character Operators (==, !=, <=, >=, :=)
            const nextChar = this.sourceCode[this.cursor + 1];
            if (char === '=' && nextChar === '=') {
                tokens.push({ type: 'OPERATOR', value: '==', line: this.line });
                this.cursor += 2; this.column += 2; continue;
            }
            if (char === '!' && nextChar === '=') {
                tokens.push({ type: 'OPERATOR', value: '!=', line: this.line });
                this.cursor += 2; this.column += 2; continue;
            }
            if (char === '<' && nextChar === '=') {
                tokens.push({ type: 'OPERATOR', value: '<=', line: this.line });
                this.cursor += 2; this.column += 2; continue;
            }
            if (char === '>' && nextChar === '=') {
                tokens.push({ type: 'OPERATOR', value: '>=', line: this.line });
                this.cursor += 2; this.column += 2; continue;
            }
            if (char === ':' && nextChar === '=') {
                tokens.push({ type: 'OPERATOR', value: ':=', line: this.line });
                this.cursor += 2; this.column += 2; continue;
            }

            // Single-character Operators & Punctuation
            const operators = ['+', '-', '*', '/', '=', '<', '>'];
            if (operators.includes(char)) {
                tokens.push({ type: 'OPERATOR', value: char, line: this.line });
                this.cursor++; this.column++; continue;
            }

            const punctuation = ['{', '}', '(', ')', ';', ','];
            if (punctuation.includes(char)) {
                tokens.push({ type: 'PUNCTUATION', value: char, line: this.line });
                this.cursor++; this.column++; continue;
            }

            this.cursor++;
            this.column++;
        }

        tokens.push({ type: 'EOF', value: null, line: this.line });
        return tokens;
    }
}