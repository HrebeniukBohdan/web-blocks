import { VDomNodeChildren } from './../vdom/h';
import { IModule, Injectable } from './types';
import { registerDependency } from "../di/di";
import { createScope, flattenArray, getScopeProp, renderModificator } from "./../modificator";
import { wbModule } from "./module";
import { ConstructorClass } from "./types";
import { compileTemplate, L } from "./compile";
import { renderWebBlock } from "./render";
import { useFilter } from './filter';
import 'reflect-metadata';

const h = renderWebBlock;
const m = renderModificator;
const a = flattenArray;
const s = createScope;
const g = getScopeProp;
const uf = useFilter;

type H = typeof renderWebBlock;
type ManualRenderTemplateFunc = (ctx: unknown, h: H) => VDomNodeChildren;

export function patchForwardRefs(clazz: Injectable): void {
    clazz.ωß_FORWARD_REFS?.forEach(r => clazz.ωß_INJECT[r.index] = r.ref);
}

export function WbModule<TClass extends ConstructorClass>(params: {
    root: ConstructorClass,
    blocks?: ConstructorClass[],
    modificators?: ConstructorClass[],
    services?: ConstructorClass[],
    filters?: ConstructorClass[]
}): (target: TClass) => IModule {
    return function (target: TClass): IModule {
        const t: any = target;
        t.ωß_root = params.root;
        t.ωß_blocks = params.blocks;
        t.ωß_modificators = params.modificators;
        t.ωß_services = params.services;
        return <IModule>t;
    };
}

export function WebBlock<TClass extends ConstructorClass>(params: {
    selector: string
    template: string|ManualRenderTemplateFunc
}): (target: TClass) => TClass {
    return function (target: TClass): TClass {
        const componentName = `wb-${params.selector}`;
        const t: any = target;

        t.ωß_INJECT = Reflect.getMetadata('design:paramtypes', target) || [];
        t.ωß_COMPONENT_NAME = componentName;

        if (typeof params.template === 'string') {
            const renderTemplate = compileTemplate(params.template);
            t.ωß_Template = (ctx: unknown, l: L) => renderTemplate(h, m, s, g, a, l, uf, ctx);
        } else 
        if (typeof params.template === 'function') {
            const renderTemplate = params.template;
            t.ωß_Template = (ctx: unknown) => renderTemplate(ctx, h);
        } else {
            throw Error('Template type is incompatible');
        }

        patchForwardRefs(t);
        registerDependency(t, false);
        wbModule.registerComponentFactory(componentName, t);

        return <TClass>target;
    };
}

export function Service<TClass extends ConstructorClass>(): (target: TClass) => TClass {
    return function (target: TClass): TClass {
        const t: any = target;
        t.ωß_INJECT = Reflect.getMetadata('design:paramtypes', target) || [];
        patchForwardRefs(t);
        registerDependency(t, true);
        return <TClass>target;
    };
}

export function Filter<TClass extends ConstructorClass>(params: { filterName: string }): (target: TClass) => TClass {
    return function (target: TClass): TClass {
        const t: any = target;
        
        if (t.prototype.transform && typeof t.prototype.transform === 'function') {
            t.ωß_INJECT = Reflect.getMetadata('design:paramtypes', target) || [];
            patchForwardRefs(t);
            registerDependency(t, true);
            wbModule.registerFilter(params.filterName, t);
        } else {
            throw new Error(`Filter class "${t.prototype.name}" must implement ITransform interface.`);
        }
        
        return <TClass>target;
    };
}


interface EmptySignal {
    (): void
}
interface TypedSignal<T> {
    (payload: T): void
}

export type SignalType<T = undefined> = T extends undefined ? EmptySignal : TypedSignal<T>;

export function Signal(target: any, propertyKey: string): void {
    if (target.constructor['ωß_SIGNAL_NAMES'] === undefined) {
        target.constructor['ωß_SIGNAL_NAMES'] = [];
    }
    const SIGNAL_NAMES = target.constructor['ωß_SIGNAL_NAMES'] as string[];
    SIGNAL_NAMES.push(propertyKey);

    target[`ωß_signal_${propertyKey}`] = (): void => { return undefined };
    const getter = function() {
        return this[`ωß_signal_${propertyKey}`];
    };

    if (delete target[propertyKey]) {
        Object.defineProperty(target, propertyKey, {
            get: getter
        });
    }
}

export function Prop(target: any, propertyKey: string): void {
    if (target.constructor['ωß_PROP_NAMES'] === undefined) {
        target.constructor['ωß_PROP_NAMES'] = [];
    }
    const PROP_NAMES = target.constructor['ωß_PROP_NAMES'] as string[];
    PROP_NAMES.push(propertyKey);
}

export function State(target: any, propertyKey: string): void {
    if (target.constructor['ωß_STATE_NAMES'] === undefined) {
        target.constructor['ωß_STATE_NAMES'] = [];
    }
    const STATE_NAMES = target.constructor['ωß_STATE_NAMES'] as string[];
    STATE_NAMES.push(propertyKey);

    target[`ωß_${propertyKey}`] = target[propertyKey];
    const getter = function() {
        return this[`ωß_${propertyKey}`];
    };
    const setter = function(newVal: unknown) {
        this[`ωß_${propertyKey}`] = newVal;
        const updateStateHook: () => void = this[`ωß_$$updateState$$`];
        updateStateHook && updateStateHook();
        //markStateChanged();
    };

    if (delete target[propertyKey]) {
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });
    }
}