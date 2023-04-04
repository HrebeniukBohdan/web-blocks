import { useScopeIndex } from "./../../Parser";
import { Attribute, Attributes, NodeContainerWithAttributes, Node, ScopedElement } from "../types";

export class ModificatorNode implements NodeContainerWithAttributes, ScopedElement {
    type = 'Modificator';
    private _children: Node[] = [];
    private _attrs: Attributes = {};
    private _name: string;
    public scopeIndex: number = useScopeIndex();

    constructor(name: string, public nestingLevel: number, public parentScope: ScopedElement) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }
    get attributes(): Attributes { 
        return this._attrs;
    }
    addAttribute(attr: Attribute): void {
        this._attrs[attr.name] = attr;
    }
    addNode(child: Node): void {
        if (this._children.includes(child)) {
            throw new Error('Element node is already containing this node')
        }
        if (this._children.length) {
            throw new Error('Modificator can contain the only child. If you need to pass more than one please unify them with the parent element.');
        }
        this._children.push(child);
    }
    get children(): Node[] {
        return this._children;
    }
    exec(): string {
        return `m("${this._name}", s(sl, sl[${this.parentScope.scopeIndex}]), { ${this.evalAttrs()} }, function() { return ${this.evalChild()} })`;
    }

    private spaces(step = 0): string {
        const list: string[] = new Array<string>(this.nestingLevel + step).fill(' ');
        return list.join('');
    }

    private evalChild() {
        return `${this._children[0].exec()};`;
    }

    private evalAttrs() {
        return Object
                .keys(this._attrs)
                .map(attrName => this._attrs[attrName])
                .map(attr => attr.exec() as string)
                .join(', ');
    }
}