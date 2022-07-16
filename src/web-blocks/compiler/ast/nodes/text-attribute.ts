import { Attribute } from "../types";

export class TextAttribute implements Attribute {
    type = 'TextAttribute';
    
    constructor(private _name: string, private value: string) {}

    get name(): string {
        return this._name;
    }

    exec(): string {
        return `${this.name}: "${this.value}"`;
    }
}