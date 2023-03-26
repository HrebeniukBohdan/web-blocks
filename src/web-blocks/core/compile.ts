import { VDomNodeChildren } from './../vdom/h';
import { Compiler } from '../compiler/Compiler';
import { createScope, flattenArray, getScopeProp, renderModificator } from "./../modificator";
import { renderWebBlock } from "./render";
import { useFilter } from './filter';

const compiler = new Compiler();

type H = typeof renderWebBlock;
type M = typeof renderModificator;
type A = typeof flattenArray;
type S = typeof createScope;
type G = typeof getScopeProp;
export type L = <F extends (...args: unknown[]) => unknown>(f: F) => F;
type UF = typeof useFilter;
type RenderTemplateFunc = (h: H, m: M, s: S, g: G, a: A, l: L, f:UF, ctx: unknown) => VDomNodeChildren;

export function compileTemplate(templateSource: string): RenderTemplateFunc {
    console.log(compiler.compile(templateSource));
    return new Function('renderComp', compiler.compile(templateSource)) as RenderTemplateFunc;
}