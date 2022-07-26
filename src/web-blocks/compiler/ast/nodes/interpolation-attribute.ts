import { Attribute, ExpressionNode } from "../types";

export class InterpolationAttribute implements Attribute {
    type = 'InterpolationAttribute';

    constructor(private _name: string, private interpolNode: ExpressionNode) {}
    
    get name(): string {
        return this._name;
    }

    exec(): string {
        return `${this.name}: ${this.interpolNode.exec()}`;
    }
}