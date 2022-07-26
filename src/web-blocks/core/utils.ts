import { ConstructorClass, KeyValueMap } from "./types";
import { VNode } from "snabbdom/build";

/** returns true if objects are equal **/
export function isChanged(obj1: KeyValueMap, obj2: KeyValueMap, compPropNames: string[]): boolean {
    return compPropNames.some(propName => obj1[propName] !== obj2[propName]);
}

/** copy prop values from one object to another one **/
export function patchObj(src: KeyValueMap, dest: KeyValueMap, compPropNames: string[]): void {
    compPropNames.forEach(propName => dest[propName] = src[propName]);
}

/** if modificator alternative util for manual rendering **/
export function wbIf(cond: boolean, node: VNode): VNode|null {
    return cond ? node : null;
}

export type ForwardedType = { 
    (): ConstructorClass; 
    isForwardRef: boolean 
};
export function forwardRef(factory: () => ConstructorClass): ForwardedType {
    (factory as ForwardedType).isForwardRef = true;
    console.log(factory);
    return factory as ForwardedType;
}