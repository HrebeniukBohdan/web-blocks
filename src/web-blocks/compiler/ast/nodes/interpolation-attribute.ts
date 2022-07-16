import { Attribute } from "../types";
import { FunctionNode } from "./function";
import { NumberNode } from "./number";
import { StringNode } from "./string";
import { VariableNode } from "./variable";

export class InterpolationAttribute implements Attribute {
    type = 'InterpolationAttribute';

    constructor(private _name: string, private interpolNode: StringNode|NumberNode|VariableNode|FunctionNode) {}
    
    get name(): string {
        return this._name;
    }

    exec(): string {
        return `${this.name}: ${this.interpolNode.exec()}`;
    }
}