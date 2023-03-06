import { WbComponent } from './../vdom/component';
import { SignalType } from './decorator';
import { VNodeChildren } from 'snabbdom/build';
import { ForwardedType } from "../di";

export interface KeyValueMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export type ConstructorClass = {
    new(...args: any[]): any; 
};

export interface Props {
    [propName: string]: any;
}

export interface Signals {
    [signalName: string]: SignalType;
}

export type Injectable = { 
    ωß_INJECT: Array<ConstructorClass|ForwardedType>;
    ωß_FORWARD_REFS?: Array<{ index: number, ref: ForwardedType }>
}

export type WbComponentType = ConstructorClass & Injectable & {
    ωß_COMPONENT_NAME: string;
    ωß_PROP_NAMES: string[];
    ωß_STATE_NAMES: string[];
    ωß_SIGNAL_NAMES: string[];
    ωß_Template: (s: any) => VNodeChildren;
};

export interface IModule {
    ωß_root: ConstructorClass;
    ωß_blocks?: ConstructorClass[];
    ωß_modificators?: ConstructorClass[];
    ωß_services?: ConstructorClass[];

    new(): any; 
}

/** WebBlock hooks interfaces **/
export interface WbInit {
    wbInit: () => void;
}

export interface WbViewInit {
    wbViewInit: () => void;
}

export interface WbChange {
    wbChange: () => void;
}

export interface WbDestroy {
    wbDestroy: () => void;
}

export type ComponentFactory = () => WbComponent<any, any>;