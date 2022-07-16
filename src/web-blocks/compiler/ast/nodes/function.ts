import { Node, NodeContainer } from "../types";

export class FunctionNode implements NodeContainer {
    type = 'Function';
    private _children: Node[] = [];
    public nestingLevel: number;
    constructor(private funcName: string) {}

    addNode(child: Node): void {
        if (this._children.includes(child)) {
            throw new Error('Element node is already containing this node')
        }
        this._children.push(child);
    }
    get children(): Node[] {
        return this._children;
    }

    exec(): string {
        return `ctx.${this.funcName}(${this.evalArgs()})`;
    }

    private evalArgs(): string {
        return this.children.map(arg => arg.exec()).join(', ');
    }
}