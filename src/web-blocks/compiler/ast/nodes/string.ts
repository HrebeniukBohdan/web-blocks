import { Node } from "../types";

export class StringNode implements Node {
    type = 'String';
    constructor(private value: string) {}

    exec(): string {
        return `"${this.value}"`;
    }
}