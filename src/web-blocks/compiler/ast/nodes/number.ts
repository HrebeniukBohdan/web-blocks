import { Node } from "../types";

export class NumberNode implements Node {
    type = 'Number';
    constructor(private value: string) {}

    exec(): string {
        return `${Number(this.value)}`;
    }
}