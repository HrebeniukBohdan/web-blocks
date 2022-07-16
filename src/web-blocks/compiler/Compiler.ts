import { Parser } from './Parser';

export class Compiler {
    compile(source: string): string {
        return new Parser(source).parse().exec();
    }
}