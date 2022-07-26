import { Node } from "../types";

export class BooleanNode implements Node {
    type = 'Boolean';
    constructor(private value: string) {}

    exec(): string {
        return this.value;
    }
}