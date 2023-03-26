import { Node, NodeContainer } from "../types";

export class FilterNode implements NodeContainer {
    type = 'Filter';
    private _children: Node[] = [];
    private inputParamNode: Node;
    public nestingLevel: number;

    constructor(private filterName: string) {}

    addInputParam(paramNode: Node): void {
        if (this.inputParamNode) {
            throw new Error('Filter input param node is already added')
        }
        this.inputParamNode = paramNode;
    }

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
        return `f("${this.filterName}")(${this.evalArgs()})`;
    }

    private evalArgs(): string {
        return [this.inputParamNode, ...this.children].map(arg => arg.exec()).join(', ');
    }
}