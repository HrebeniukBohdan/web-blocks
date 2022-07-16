import { ParentScope, ScopedElement, Node } from "../types";

export class VariableNode implements Node, ParentScope {
    type = 'Variable';
    
    constructor(private varName: string, public parentScope: ScopedElement) {}

    exec(): string {
        return `g('${this.varName}', sl[${this.parentScope.scopeIndex}])`;
    }
}