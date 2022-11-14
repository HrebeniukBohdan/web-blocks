import { injectDependency } from './../di/di';
import { VNodeChildren, VNode } from 'snabbdom/build';
import { wbModule } from '../core/module';
import { IModificator, IScope, ModificatorProps, ModificatorRenderContentFunc } from "./types";

export function getScopeProp(key: string, scope: IScope): unknown {
    let currentScope = scope;
    while(currentScope) {
        // eslint-disable-next-line no-prototype-builtins
        if (currentScope.hasOwnProperty(key) || currentScope.hasOwnProperty(`ωß_${key}`)) {
            return currentScope[key];
        }
        currentScope = currentScope.$$parent;
        if (!currentScope) {
            throw new Error(`"${key}" property is not defined within current scope.`);
        }
    }
}

export function createScope(scopes: IScope[], parentScope?: IScope): IScope {
    const scope = {} as IScope;
    if (parentScope) {
        scope.$$parent = parentScope;
    }
    scopes.push(scope);
    return scope;
}

/* applies a modificator functionality */
export function renderModificator(
    name: string,
    scope: IScope,
    props: ModificatorProps,
    renderFunc: ModificatorRenderContentFunc
): VNodeChildren|VNode|null {
    const modificatorClass = wbModule.getModificator(name);
    const modInstance: IModificator = injectDependency(modificatorClass as any);

    return modInstance.modify(renderFunc, props, scope);
}

export function flattenArray(array: unknown[]): unknown[] {
    return [].concat(...array);
}