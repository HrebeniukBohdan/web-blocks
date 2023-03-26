import { BooleanNode } from "./nodes/boolean";
import { FilterNode } from "./nodes/filter";
import { FunctionNode } from "./nodes/function";
import { NumberNode } from "./nodes/number";
import { StringNode } from "./nodes/string";
import { VariableNode } from "./nodes/variable";

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

export interface EventBindAttribute extends Attribute {
    get num(): number;
    execCallback(): string;
}


export interface NodeContainerWithAttributes extends NodeContainer {
    get name(): string;
    get attributes(): { [attrName: string]: Attribute };
    addAttribute(attr: Attribute): void;
}

export interface Element extends NodeContainerWithAttributes {
    get eventBindings(): { [eventName: string]: EventBindAttribute };
    addEventBind(evBind: EventBindAttribute): void;
}

export type Attributes = { [attrName: string]: Attribute };

export type EventBindings = { [eventName: string]: EventBindAttribute };

export type ExpressionNode = BooleanNode|StringNode|NumberNode|VariableNode|FilterNode|FunctionNode;