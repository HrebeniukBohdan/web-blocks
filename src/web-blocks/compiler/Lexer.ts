import { Token } from "./Token";
import { tokenTypeList } from "./TokenType";

export class Lexer {
    source: string;
    position: number;
    tokens: Token[] = [];

    constructor(source: string) {
        this.source = source.trim();
        this.position = 0;
    }

    tokenize(): Token[] {
        while (this.nextToken()) {
            // new token found
        }

        return this.tokens;
    }

    nextToken(): boolean {
        if (this.position >= this.source.length) {
            return false;
        }

        for (let index = 0; index < tokenTypeList.length; index++) {
            const tokenType = tokenTypeList[index];
            const regex = new RegExp('^' + tokenType.regex);
            const result = this.source.substr(this.position).match(regex);
            if (result) {
                // supports RegEx with one group
                const raw_value = result[0];
                const value = result[result.length - 1];
                const token = new Token(tokenType, value, this.position);
                this.position += raw_value.length;
                this.tokens.push(token);
                return true;
            }
        }

        throw new Error(
            `Lexical error is found at position: 
            ${this.source.slice(0, this.position) + ' !== See here (Unknown token) ==> ' + this.source.slice(this.position)}
            `);
    }
}