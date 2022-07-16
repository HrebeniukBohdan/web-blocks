import { VNode, VNodeChildren } from "snabbdom/build";
import { KeyValueMap } from "./../core";

export type ModificatorProps = KeyValueMap;

export interface IScope extends KeyValueMap {
    $$parent?: IScope;
}

export type ModificatorRenderContentFunc = () => VNode|null;

export interface IModificator {
    (renderFunction: ModificatorRenderContentFunc, props: ModificatorProps, scope: IScope): VNodeChildren|VNode|null
}