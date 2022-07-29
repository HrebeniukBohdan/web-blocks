import { injectDependency } from './../di/di';
import { Props, Signals, WbComponentType } from './types';
import { h, VNode, VNodeChildren } from 'snabbdom/build';
import { isChanged, patchObj } from './utils';

interface WebComponentHooks {
    wbInit?: () => void;
    wbViewInit?: () => void;
    wbChange?: () => void;
    wbDestroy?: () => void;
}

export class ComponentController {
    
    private ωß_componentDestroyHook: () => void;
    private ωß_renderTemplate: (s: any) => VNodeChildren;
    private ωß_COMPONENT_NAME: string;
    private ωß_PROP_NAMES: string[];
    private ωß_STATE_NAMES: string[];
    private ωß_SIGNAL_NAMES: string[];
    private ωß_cachedVNode: VNode;
    private ωß_prevProps: Props;
    private ωß_state: Props;
    private ωß_firstRender = true;
    private ωß: WebComponentHooks;

    constructor(type: WbComponentType, removeComponent: () => void) {
        this.ωß_COMPONENT_NAME = type.ωß_COMPONENT_NAME;
        this.ωß_PROP_NAMES = type.ωß_PROP_NAMES||[];
        this.ωß_STATE_NAMES = type.ωß_STATE_NAMES||[];
        this.ωß_SIGNAL_NAMES = type.ωß_SIGNAL_NAMES||[];
        this.ωß_renderTemplate = type.ωß_Template;
        // Add DI here
        this.ωß = injectDependency(type as any);
        this.ωß_state = this.ωß;
        this.ωß_componentDestroyHook = removeComponent;
    }

    private ωß_insert(emptyVNode: VNode, vNode: VNode): void {
        this.ωß.wbViewInit && this.ωß.wbViewInit();
    }

    private ωß_destroy(vNode: VNode): void {
        this.ωß.wbDestroy && this.ωß.wbDestroy();
        this.ωß = null;
        this.ωß_componentDestroyHook();
    }

    ωß_render(props?: Props, signals?: Signals): VNode {
        // signals update
        if (signals) {
            for (const [signalName, signalFunc] of Object.entries(signals)) {
                if (this.ωß_SIGNAL_NAMES.includes(signalName)) {
                    const signalContext: any = this.ωß;
                    signalContext[`ωß_signal_${signalName}`] = signalFunc;
                }
            }
        }

        // compare props and update
        let changed = false;
        if (this.ωß_prevProps) {
            changed = isChanged(this.ωß_prevProps, props, this.ωß_PROP_NAMES);
            if (changed) {
                this.ωß_prevProps = props;
            }
        } else {
            this.ωß_prevProps = props;
            changed = true;
        }
        // update props and state
        if (changed) {
            patchObj(this.ωß_prevProps, this.ωß_state, this.ωß_PROP_NAMES);
            this.ωß.wbChange && this.ωß.wbChange();

            if (this.ωß_firstRender) {
                this.ωß.wbInit && this.ωß.wbInit();
                this.ωß_firstRender = false;
            }
        }

        // rerender template if
        /* 
        if (changed) {
            this.ωß_cachedVNode = this.ωß_renderTemplateRoot();
        } else {
            this.ωß_cachedVNode = this.ωß_cachedVNode ? this.ωß_cachedVNode : this.ωß_renderTemplateRoot(); 
        }
        */

        this.ωß_cachedVNode = this.ωß_renderTemplateRoot();
        return this.ωß_cachedVNode;
    }

    private ωß_renderTemplateRoot(): VNode {
        return h(this.ωß_COMPONENT_NAME, { 
            hook: {
                insert: this.ωß_insert.bind(this),
                destroy: this.ωß_destroy.bind(this),
            }
        }, this.ωß_renderTemplate(this.ωß_state));
    }
}