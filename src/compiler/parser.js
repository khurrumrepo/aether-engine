export class AetherParser {
    constructor(tokens) {
        this.tokens = tokens;
        this.cursor = 0;
    }

    parse() {
        const ast = {
            type: 'Program',
            body: []
        };

        while (this.cursor < this.tokens.length) {
            const token = this.tokens[this.cursor];
            if (token.type === 'EOF') break;
            ast.body.push(this._parseStatement());
        }

        return ast;
    }

    _parseStatement() {
        const token = this.tokens[this.cursor];

        // Variable Declaration: let x = 10;
        if (token.type === 'KEYWORD' && token.value === 'let') {
            this.cursor++; // consume 'let'
            const identifier = this.tokens[this.cursor].value;
            this.cursor++; // consume identifier

            if (this.tokens[this.cursor].value === '=' || this.tokens[this.cursor].value === ':=') {
                this.cursor++;
            }

            const initializer = this._parseExpression();
            this._consumePunctuation(';');

            return { type: 'VariableDeclaration', identifier, initializer };
        }

        // Assignment Statement: x = x + 1;
        if (token.type === 'IDENTIFIER' && this.tokens[this.cursor + 1] && this.tokens[this.cursor + 1].value === '=') {
            const identifier = token.value;
            this.cursor++; // consume identifier
            this.cursor++; // consume '='
            const initializer = this._parseExpression();
            this._consumePunctuation(';');

            return { type: 'AssignmentStatement', identifier, initializer };
        }

        // Print Statement
        if (token.type === 'KEYWORD' && token.value === 'print') {
            this.cursor++; // consume 'print'
            this._consumePunctuation('(');
            const argument = this._parseExpression();
            this._consumePunctuation(')');
            this._consumePunctuation(';');

            return { type: 'PrintStatement', argument };
        }

        // If Statement
        if (token.type === 'KEYWORD' && token.value === 'if') {
            this.cursor++; // consume 'if'
            this._consumePunctuation('(');
            const condition = this._parseExpression();
            this._consumePunctuation(')');
            const consequent = this._parseBlockStatement();

            let alternate = null;
            if (this.tokens[this.cursor] && this.tokens[this.cursor].type === 'KEYWORD' && this.tokens[this.cursor].value === 'else') {
                this.cursor++; // consume 'else'
                alternate = this._parseBlockStatement();
            }

            return { type: 'IfStatement', condition, consequent, alternate };
        }

        // While Loop
        if (token.type === 'KEYWORD' && token.value === 'while') {
            this.cursor++; // consume 'while'
            this._consumePunctuation('(');
            const condition = this._parseExpression();
            this._consumePunctuation(')');
            const body = this._parseBlockStatement();

            return { type: 'WhileStatement', condition, body };
        }

        const expr = this._parseExpression();
        this._consumePunctuation(';');
        return expr;
    }

    _parseBlockStatement() {
        this._consumePunctuation('{');
        const body = [];
        while (this.cursor < this.tokens.length && this.tokens[this.cursor].value !== '}') {
            body.push(this._parseStatement());
        }
        this._consumePunctuation('}');
        return { type: 'BlockStatement', body };
    }

    _parseExpression() {
        return this._parseComparison();
    }

    _parseComparison() {
        let left = this._parseAdditive();

        while (
            this.cursor < this.tokens.length &&
            this.tokens[this.cursor].type === 'OPERATOR' &&
            ['==', '!=', '<', '>', '<=', '>='].includes(this.tokens[this.cursor].value)
        ) {
            const operator = this.tokens[this.cursor].value;
            this.cursor++;
            const right = this._parseAdditive();
            left = { type: 'BinaryExpression', operator, left, right };
        }

        return left;
    }

    _parseAdditive() {
        let left = this._parseMultiplicative();

        while (
            this.cursor < this.tokens.length &&
            this.tokens[this.cursor].type === 'OPERATOR' &&
            (this.tokens[this.cursor].value === '+' || this.tokens[this.cursor].value === '-')
        ) {
            const operator = this.tokens[this.cursor].value;
            this.cursor++;
            const right = this._parseMultiplicative();
            left = { type: 'BinaryExpression', operator, left, right };
        }

        return left;
    }

    _parseMultiplicative() {
        let left = this._parsePrimary();

        while (
            this.cursor < this.tokens.length &&
            this.tokens[this.cursor].type === 'OPERATOR' &&
            (this.tokens[this.cursor].value === '*' || this.tokens[this.cursor].value === '/')
        ) {
            const operator = this.tokens[this.cursor].value;
            this.cursor++;
            const right = this._parsePrimary();
            left = { type: 'BinaryExpression', operator, left, right };
        }

        return left;
    }

    _parsePrimary() {
        const token = this.tokens[this.cursor];

        if (token.type === 'NUMBER') {
            this.cursor++;
            return { type: 'NumericLiteral', value: token.value };
        }
        if (token.type === 'STRING') {
            this.cursor++;
            return { type: 'StringLiteral', value: token.value };
        }
        if (token.type === 'IDENTIFIER') {
            this.cursor++;
            return { type: 'Identifier', name: token.value };
        }
        if (token.value === '(') {
            this.cursor++;
            const expr = this._parseExpression();
            this._consumePunctuation(')');
            return expr;
        }

        this.cursor++;
        return { type: 'EmptyLiteral', value: null };
    }

    _consumePunctuation(val) {
        if (this.tokens[this.cursor] && this.tokens[this.cursor].value === val) {
            this.cursor++;
        }
    }
}