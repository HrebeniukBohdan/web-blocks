import { Node } from "../types";

export class TextNode implements Node {
    type = 'Text';
    constructor(private text: string) {}

    exec(): string {
        return `"${this.text.trim()}"`;
    }
}