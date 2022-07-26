import { Node } from "../types";

export class EventVariableNode implements Node {
    type = 'EventVariable';
    
    constructor(private varName: string) {}

    exec(): string {
        return `event`;
    }
}