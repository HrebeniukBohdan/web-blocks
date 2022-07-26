import { Attribute, Attributes, EventBindAttribute, Element, Node, EventBindings } from "../types";

export class ElementNode implements Element {
    type = 'Element';
    
    private _children: Node[] = [];
    private _attrs: Attributes = {};
    private _evBindings: EventBindings = {};
    private _name: string;

    constructor(name: string, public nestingLevel: number) {
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

    get eventBindings(): EventBindings {
        return this._evBindings;
    }

    addEventBind(evBind: EventBindAttribute): void {
        if (this._evBindings[evBind.name]) {
            throw new Error(`Element node has duplicates of event bindinds "${evBind.name}"`)
        }
        this._evBindings[evBind.name] = evBind;
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
        return `h("${this.name}", { ${this.evalAttrs()} }, { ${this.evalEventBindings()} }${this.evalChildren()})`;
    }

    private spaces(step = 0): string {
        const list: string[] = new Array<string>(this.nestingLevel + step).fill(' ');
        return list.join('');
    }

    private evalChildren() {
        const childrenStr = this._children.length ? ', a([\n' + this._children
        .map(node => this.spaces(1) + node.exec() as string)
        .join(',\n') + '\n' + this.spaces(1) + '])\n' + this.spaces() : '';

        return childrenStr;
    }

    private evalAttrs() {
        return Object
                .keys(this._attrs)
                .map(attrName => this._attrs[attrName])
                .map(attr => attr.exec() as string)
                .join(', ');
    }

    private evalEventBindings() {
        return Object
                .keys(this._evBindings)
                .map(eventName => this._evBindings[eventName])
                .map(ev => ev.exec() as string)
                .join(', ');
    }
}