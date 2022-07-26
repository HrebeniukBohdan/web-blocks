import { initScopeIndex } from "./../../Parser";
import { EventBindAttribute, Node, NodeContainer, ScopedElement } from "../types";

export class RootNode implements NodeContainer, ScopedElement {
    type = 'RootNode';

    private _children: Node[] = [];
    private _allBindings: EventBindAttribute[] = [];
    public nestingLevel = 2;
    public scopeIndex: number = initScopeIndex();

    addNode(child: Node): void {
        if (this._children.includes(child)) {
            throw new Error('Element node is already containing this node')
        }
        this._children.push(child);
    }

    get children(): Node[] {
        return this._children;
    }

    addEventBind(evBind: EventBindAttribute): void {
        this._allBindings.push(evBind);
    }

    private evalEventBindings(): string {
        return this._allBindings.map(b => b.execCallback()).join('');
    }

    exec(): string {
        const args1Source = ' var h = arguments[0];\n var m = arguments[1];\n var s = arguments[2];\n var g = arguments[3];\n';
        const args2Source = ' var a = arguments[4];\n var ctx = arguments[5];\n var sl = [ctx];\n\n';
        const eventBindings = this.evalEventBindings();
        const nodeSource = ' return a([\n' 
            + this.children.map(node => '   ' + node.exec() as string).join(',\n')
            + '\n ]);\n';

        return args1Source + args2Source + eventBindings + nodeSource;
    }
}