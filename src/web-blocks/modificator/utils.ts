import { VDomNode } from './../vdom/virtual_dom';
import { VDomNodeChildren } from './../vdom/h';
import { injectDependency } from './../di/di';
import { wbModule } from '../core/module';
import { IModificator, IScope, ModificatorProps, ModificatorRenderContentFunc } from "./types";

export function getScopeProp(key: string, scope: IScope): unknown {
    let currentScope = scope;
    while(currentScope) {
        if (key.includes('.')) {
            const path = key.split('.');
            let currentObjectValue = currentScope[path[0]];
            for (let index = 1; index < path.length; index++) {
                if (typeof currentObjectValue === 'object') {
                    currentObjectValue = currentObjectValue[path[index]];
                } else {
                    throw new Error(
                        `ObjectPathReadingError: "${path.slice(0, index).join('.')}" path property is not defined within current scope or it's not of Object type.`
                    );
                }
            }
            return currentObjectValue;
        } else {
            // eslint-disable-next-line no-prototype-builtins
            if (currentScope.hasOwnProperty(key) || currentScope.hasOwnProperty(`ωß_${key}`)) {
                return currentScope[key];
            }
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
): VDomNodeChildren|VDomNode|null {
    const modificatorClass = wbModule.getModificator(name);
    const modInstance: IModificator = injectDependency(modificatorClass as any);

    return modInstance.modify(renderFunc, props, scope);
}

export function flattenArray(array: unknown[]): unknown[] {
    return [].concat(...array);
}