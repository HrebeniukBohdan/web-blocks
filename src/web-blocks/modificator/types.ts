import { VDomNodeChildren } from './../vdom/h';
import { VDomNode } from './../vdom/virtual_dom';
import { KeyValueMap } from "./../core";

export type ModificatorProps = KeyValueMap;

export interface IScope extends KeyValueMap {
    $$parent?: IScope;
}

export type ModificatorRenderContentFunc = () => VDomNode|null;

export interface IModificator {
    modify(renderFunction: ModificatorRenderContentFunc, props: ModificatorProps, scope: IScope): VDomNodeChildren|VDomNode|null
}