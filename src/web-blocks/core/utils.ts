import { ConstructorClass } from "./types";

/** returns true if objects are equal **/
export function isChanged(obj1: any, obj2: any, compPropNames: string[]): boolean {
    return compPropNames.some(propName => obj1[propName] !== obj2[propName]);
}

export function patchObj(src: any, dest: any, compPropNames: string[]): any {
    compPropNames.forEach(propName => dest[propName] = src[propName]);
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