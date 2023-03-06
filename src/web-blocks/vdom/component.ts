import { Injectable, ConstructorClass } from './../core/types';
import { createDiff, VDomNodeUpdater } from "./diffs"
import { applyUpdate } from "./render"
import { VDomNode } from "./virtual_dom"

import { injectDependency } from './../di/di';
import { Props, Signals } from '../core/types';
import { h, VDomNodeChildren } from "./h";
import { patchObj } from '../core/utils';
import { L } from '../core/compile';

interface WebComponentHooks {
    wbInit?: () => void;
    wbViewInit?: (elem: HTMLElement | Text) => void;
    wbChange?: () => void;
    wbDestroy?: () => void;
}

export type WbComponentType = ConstructorClass & Injectable & {
    ωß_COMPONENT_NAME: string;
    ωß_PROP_NAMES: string[];
    ωß_STATE_NAMES: string[];
    ωß_SIGNAL_NAMES: string[];
    ωß_Template: (s: any, l: L) => VDomNodeChildren;
};

export class WbComponent<P, S> {
    
    private ωß_renderTemplate: (s: any, l: L) => VDomNodeChildren;
    private ωß_COMPONENT_NAME: string;
    private ωß_PROP_NAMES: string[];
    private ωß_STATE_NAMES: string[];
    private ωß_SIGNAL_NAMES: string[];
    private ωß_cachedVNode: VDomNode;
    private ωß_prevProps: Props;
    private ωß_state: Props;
    private ωß_firstRender = true;
    private ωß: WebComponentHooks;
    private ωß_key?: string;
    private ωß_listenerPointerIndex: number;
    private ωß_listenerCacheArray: Array<(...args: unknown[]) => unknown>;
    public ωß_SIGNAL_PROP_NAMES: string[];

    constructor(type: WbComponentType) {
        this.ωß_COMPONENT_NAME = type.ωß_COMPONENT_NAME;
        this.ωß_PROP_NAMES = type.ωß_PROP_NAMES||[];
        this.ωß_STATE_NAMES = type.ωß_STATE_NAMES||[];
        this.ωß_SIGNAL_NAMES = type.ωß_SIGNAL_NAMES||[];
        this.ωß_SIGNAL_PROP_NAMES = [
            ...this.ωß_PROP_NAMES,
            ...this.ωß_SIGNAL_NAMES
        ];
        this.ωß_listenerCacheArray = [];
        this.ωß_renderTemplate = type.ωß_Template;
        // Add DI here
        this.ωß = injectDependency(type as any);
        (this.ωß as any).ωß_$$updateState$$ = () => this.setState(); 
        this.ωß_state = this.ωß;
    }
    
    private currentRootNode: VDomNode
    private mountedElement: HTMLElement | Text
    
    private setState() {
        if(this.mountedElement == undefined) {
            throw new Error("you are updating an unmounted component")
        }
        
        applyUpdate(this.mountedElement, this.getUpdateDiff())
    }

    private updateSignals(signals: Signals): void {
        this.ωß_SIGNAL_NAMES.forEach((signalName) => {
            if (signals[signalName] && typeof signals[signalName] === 'function') {
                const signalContext: any = this.ωß;
                const signalFunc: any = signals[signalName];
                signalContext[`ωß_signal_${signalName}`] = signalFunc;
            }
        })
    }

    private updateProps(props: Props): void {
        patchObj(props, this.ωß, this.ωß_PROP_NAMES);
    }
    
    public setProps(props: P): VDomNodeUpdater {
        if(this.mountedElement == null) {
            throw new Error("You are setting the props of an inmounted component")
        }

        // this.state = this.componentWillRecieveProps(props, this.state)
        this.updateSignals(props as any);
        // add update props
        this.updateProps(props);
        return this.getUpdateDiff()
    }
    
    public initProps(props: P): VDomNode {
        this.updateSignals(props as any);
        // add update props
        this.updateProps(props);
        this.currentRootNode = this.render()
        return this.currentRootNode
    }
    
    private getUpdateDiff() : VDomNodeUpdater {
        const newRootNode = this.render()
        const diff = createDiff(this.currentRootNode, newRootNode)
        if(diff.kind == 'replace') { 
            diff.callback = elem => this.mountedElement = elem
        }
        this.currentRootNode = newRootNode
        setTimeout(
            () => this.componentDidUpdate()
        )
        return diff
    }
    
    public notifyMounted(elem: HTMLElement | Text) {
        this.mountedElement = elem
        setTimeout(() => this.componentDidInit())
        setTimeout(() => this.componentDidMount(elem))
    }

    public unmount() {
        this.componentWillUnmount()
        this.mountedElement = null
    }
    
    // hooks call
    public componentDidInit() {
        // this.ωß.wbChange && this.ωß.wbChange();
        this.ωß.wbInit && this.ωß.wbInit();
    }

    public componentDidMount(elem: HTMLElement | Text) {
        this.ωß.wbViewInit && this.ωß.wbViewInit(elem);
    }

    public componentWillRecieveProps(props: P, state: S): S { return state }
    
    public componentDidUpdate() {
        this.ωß.wbChange && this.ωß.wbChange();
    }

    public componentWillUnmount() {
        this.ωß.wbDestroy && this.ωß.wbDestroy();
    }

    // render
    render(): VDomNode {
        this.ωß_listenerPointerIndex = 0;
        const useCachedListener = (f: (...args: unknown[]) => unknown) => {
            if (this.ωß_listenerCacheArray[this.ωß_listenerPointerIndex]) {
                return this.ωß_listenerCacheArray[this.ωß_listenerPointerIndex++];
            }

            this.ωß_listenerCacheArray[this.ωß_listenerPointerIndex++] = f;
            return f;
        }

        console.log(`Render ${this.ωß_COMPONENT_NAME}`);
        return h(this.ωß_COMPONENT_NAME, {}, this.ωß_renderTemplate(this.ωß_state, useCachedListener));
    }
}