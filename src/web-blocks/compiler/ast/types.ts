/***************** AST Interfaces ******************/
export interface Node {
    type: string;
    exec(): any;
}

export interface NodeContainer extends Node {
    nestingLevel: number;
    addNode(child: Node): void;
    get children(): Node[];
}

export interface ScopedElement {
    scopeIndex: number;
    parentScope?: ScopedElement;
}

export interface ParentScope {
    parentScope: ScopedElement;
}

export interface Attribute extends Node {
    get name(): string;
}

export interface Element extends NodeContainer {
    get name(): string;
    get attributes(): { [attrName: string]: Attribute };
    addAttribute(attr: Attribute): void;
}

export type Attributes = { [attrName: string]: Attribute };