import { EventBindAttribute } from "../types";
import { FunctionNode } from "./function";

export class EvBindAttribute implements EventBindAttribute {
    type = 'EventBindAttribute';

    constructor(private _name: string, private _num: number, private functionNode: FunctionNode) {}
    
    get name(): string {
        return this._name;
    }

    get num(): number {
        return this._num;
    }

    exec(): string {
        return `${this.name}: cb_${this.num}`;
    }

    execCallback(): string {
        return ' const cb_' + this.num + ' = l(function() {\n' +
          '   var event = arguments[0]; \n' +
          '   console.log(ctx); \n' +
          `   ${this.functionNode.exec()};` + '\n });\n\n';
    }
}