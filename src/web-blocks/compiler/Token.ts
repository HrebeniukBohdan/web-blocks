import { TokenType } from './TokenType';

export class Token {
    constructor(
        public type: TokenType,
        public value: string,
        public position: number
    ) {}
}