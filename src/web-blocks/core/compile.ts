import { VDomNodeChildren } from './../vdom/h';
import { Compiler } from '../compiler/Compiler';
import { createScope, flattenArray, getScopeProp, renderModificator } from "./../modificator";
import { renderWebBlock } from "./render";
import { useFilter } from './filter';

const compiler = new Compiler();

export type H = typeof renderWebBlock;
type L = <F extends (...args: unknown[]) => unknown>(f: F) => F;
type M = typeof renderModificator;
type A = typeof flattenArray;
type S = typeof createScope;
type G = typeof getScopeProp;
type UF = typeof useFilter;
type RenderTemplateFunc = (h: H, m: M, s: S, g: G, a: A, l: L, f:UF, ctx: unknown) => VDomNodeChildren;
export type HookUseCallback = L;

export function compileTemplate(templateSource: string): RenderTemplateFunc {
    console.log(compiler.compile(templateSource));
    return new Function('renderComp', compiler.compile(templateSource)) as RenderTemplateFunc;
}