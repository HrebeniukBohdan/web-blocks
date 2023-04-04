import { VDomNode } from './../vdom/virtual_dom';
import { KeyValueMap } from './types';

/** returns true if objects are equal **/
export function isChanged(obj1: KeyValueMap, obj2: KeyValueMap, compPropNames: string[]): boolean {
    return compPropNames.some(propName => obj1[propName] !== obj2[propName]);
}

export const isArray = Array.isArray;

export function isPrimitive(s: any): s is string | number {
  return (
    typeof s === "string" ||
    typeof s === "number" ||
    s instanceof String ||
    s instanceof Number
  );
}

/** copy prop values from one object to another one **/
export function patchObj(src: KeyValueMap, dest: KeyValueMap, compPropNames: string[]): void {
    compPropNames.forEach(propName => dest[propName] = src[propName]);
}

/** if modificator alternative util for manual rendering **/
export function wbIf(cond: boolean, node: VDomNode): VDomNode|null {
    return cond ? node : null;
}