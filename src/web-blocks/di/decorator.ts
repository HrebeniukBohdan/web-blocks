import { ConstructorClass } from './../core/types';

export type ForwardedType = { 
    (): ConstructorClass; 
    isForwardRef: boolean 
};

export function forwardRef(factory: () => ConstructorClass): ForwardedType {
    (factory as ForwardedType).isForwardRef = true;
    console.log(factory);
    return factory as ForwardedType;
}

export function Inject(ref: ForwardedType): (target: any, propertyKey: string, parameterIndex: number) => void {
    console.log(ref);
    return function (target: any, propertyKey: string, parameterIndex: number): void {
        target.ωß_FORWARD_REFS = target.ωß_FORWARD_REFS || [];
        target.ωß_FORWARD_REFS.push({
            index: parameterIndex,
            ref,
        })
    }
}