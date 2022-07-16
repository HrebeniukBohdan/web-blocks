import { Compiler } from '../compiler/Compiler';
import { VNodeChildren } from "snabbdom/build";
import { createScope, flattenArray, getScopeProp, renderModificator } from "./../modificator";
import { renderWebBlock } from "./render";

const compiler = new Compiler();

type H = typeof renderWebBlock;
type M = typeof renderModificator;
type A = typeof flattenArray;
type S = typeof createScope;
type G = typeof getScopeProp;
type RenderTemplateFunc = (h: H, m: M, s: S, g: G, a: A, ctx: unknown) => VNodeChildren;

export function compileTemplate(templateSource: string): RenderTemplateFunc {
    console.log(compiler.compile(templateSource));
    return new Function('renderComp', compiler.compile(templateSource)) as RenderTemplateFunc;
}