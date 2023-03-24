import { Node } from "../types";

export class CommentNode implements Node {
    type = 'Comment';
    constructor(private comment: string) {}

    exec(): string {
        return `h("!", "${this.comment}")`;
    }
}