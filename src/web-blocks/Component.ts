import { h, VNode, VNodeChildren } from "snabbdom/build";
import { useComponent } from "./core/useComponent";
import { ForwardedType, forwardRef, isChanged, patchObj } from "./core/utils";
import 'reflect-metadata';
import { markStateChanged } from "./core/engine";
import { injectDependency, registerDependency } from "./di/di";
import { HTTPService } from "./services";
import { DataService } from "./serv1";
import { ConstructorClass } from "./core/types";
import { wbIf } from "./directives";
import { wbModule } from "./core/module";
import { Modificator } from "./modificator/decorator";
import { WebBlockTemplate } from "./core";

export interface Props {
    [propName: string]: any;
}


interface ComponentConstructor {
    new (): ComponentController;
}

type Injectable = { 
    ωß_INJECT: Array<ConstructorClass|ForwardedType>;
    ωß_FORWARD_REFS?: Array<{ index: number, ref: ForwardedType }>
}

type WbComponentType = ConstructorClass & Injectable & {
    ωß_COMPONENT_NAME: string;
    ωß_PROP_NAMES: string[];
    ωß_STATE_NAMES: string[];
    ωß_Template: (s: any) => VNodeChildren;
};

export function patchForwardRefs(clazz: Injectable): void {
    clazz.ωß_FORWARD_REFS?.forEach(r => clazz.ωß_INJECT[r.index] = r.ref);
}

export function WebBlock<TClass extends ConstructorClass>(params: {
    selector: string
    template: (s: any) => VNodeChildren
}): (target: TClass) => TClass {
    return function (target: TClass): TClass {
        const componentName = `wb-${params.selector}`;
        const t: any = target;
        t.ωß_INJECT = Reflect.getMetadata('design:paramtypes', target) || [];
        t.ωß_COMPONENT_NAME = componentName;
        t.ωß_Template = params.template;
        patchForwardRefs(t);
        registerDependency(t, false);
        wbModule.registerComponent(componentName, t);
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

export function Inject(ref: ForwardedType) {
    console.log(ref);
    return function (target: any, propertyKey: string, parameterIndex: number): void {
        target.ωß_FORWARD_REFS = target.ωß_FORWARD_REFS || [];
        target.ωß_FORWARD_REFS.push({
            index: parameterIndex,
            ref,
        })
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
        markStateChanged();
    };

    if (delete target[propertyKey]) {
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });
    }
}

export const RenderComp = (componentType: ConstructorClass, props?: Props): VNode => {
    const [component] = useComponent(
        (remove: () => void) => new ComponentController(componentType as any, remove)
    );

    return component.ωß_render(props);
}
export const wb = RenderComp;

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
    private ωß_cachedVNode: VNode;
    private ωß_prevProps: Props;
    private ωß_state: Props;
    private ωß_firstRender = true;
    private ωß: WebComponentHooks;

    constructor(type: WbComponentType, removeComponent: () => void) {
        this.ωß_COMPONENT_NAME = type.ωß_COMPONENT_NAME;
        this.ωß_PROP_NAMES = type.ωß_PROP_NAMES||[];
        this.ωß_STATE_NAMES = type.ωß_STATE_NAMES||[];
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

    ωß_render(props?: Props): VNode {
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

/*
@WebBlock({
    selector: 'nested-comp',
    template: (s: NestedComponet) => h(
        'ul', 
        { style: { padding: '8px', background: 'green'} }, 
        s.list.map((li, key) => h('li', { key }, `${li}`))
    )
})
export class NestedComponet {
    @Prop list: number[];

    wbInit(): void {
        console.log('nested-comp init');
    }

    wbViewInit(): void {
        console.log('nested-comp view init');
    }

    wbDestroy(): void {
        console.log('nested-comp view destroy');
    }
}

@WebBlock({
    selector: 'my-comp',
    template: (s: MyComp) => h('div', { 
        style: { padding: '8px', background: 'red'},
        on: {
            click: s.clickHandler.bind(s)
        }
    }, [
        'It is my component ',
        h('span', {}, `"${s.name}" - "${s.state1}"`),
        wb(NestedComponet, { list: s.list })
    ]),
})
export class MyComp {
    @Prop list: number;
    @Prop yo: boolean;
    @Prop name: string;
    @State state1: string;
    @State state2: string;

    constructor(private dataServ: DataService) {}

    wbInit(): void {
        console.log('my-comp init');
    }

    wbViewInit(): void {
        console.log('my-comp view init');
    }

    wbDestroy(): void {
        console.log('my-comp view destroy');
    }

    clickHandler(): void {
        this.dataServ.getData();
        console.log('click on');
        this.state1 = this.state1 + 'a';
    }
}

@WebBlock({
    selector: 'root-component',
    template: (s: RootComponent) => h('div', { 
        style: { padding: '20px', background: 'yellow'},
    }, [
        h('button', { 
            style: { margin: '10px', padding: '10px', cursor: 'pointer' },
            on: {
                click: s.showHideHandler.bind(s)
            }
        }, `${s.show ? 'Hide':'Show'} me!`),
        h('button', { 
            style: { margin: '10px', padding: '10px', cursor: 'pointer' },
            on: {
                click: s.clickHandler.bind(s)
            }
        }, 'Add new item!'),
        wbIf(s.show, wb(MyComp, { name: s.name, list: s.list }))
    ]),
})
export class RootComponent {
    @State name = 'My super component';
    @State list = [1, 2, 3, 4, 5];
    @State show = true;

    constructor(private http: HTTPService) {
        // yo
    }

    wbInit(): void {
        console.log('root-comp init');
    }

    wbViewInit(): void {
        console.log('root-comp view init');
    }

    clickHandler(): void {
        console.log('click on root');
        this.http.post();
        this.list = [...this.list, this.list.length + 1];
    }

    showHideHandler(): void {
        this.http.put();
        this.show = !this.show;
    }
}*/

@WebBlock({
    selector: 'root-component',
    template: (s: RootComponent) => h(
        'div', 
        { }, 
        [
            h('button', { on: {
                click: s.onButtonClick.bind(s) 
              } 
            }, s.showHide ? 'Hide' : 'Show'),
            h('button', { on: {
                click: s.onAddClick.bind(s) 
              } 
            }, 'Add element'),
            h('button', { on: {
                click: s.onRemoveClick.bind(s) 
              } 
            }, 'Remove element'),
            wb(ModComponent, { show: s.showHide, list: s.list })
        ]
    )
})
export class RootComponent {
    @State showHide = false;
    @State list = [1, 2, 3, 4, 5];

    onButtonClick(): void {
        this.showHide = !this.showHide;
    }

    onAddClick(): void {
        console.log('Add button click');
        this.list = [...this.list, 1];
    }

    onRemoveClick(): void {
        console.log('Remove button click');
        this.list = this.list.slice(0, this.list.length - 1);
    }

    wbInit(): void {
        console.log('root-component init');
    }

    wbViewInit(): void {
        console.log('root-component view init');
    }

    wbDestroy(): void {
        console.log('root-component view destroy');
    }
}

@WebBlockTemplate({
    selector: 'mod-component',
    template: `
        <div>
            Yo nigga
            <div class={{$redClass}}>
                Second block
                <%wb-if condition={{$show}}%>
                    <div>
                        <div class={{$greenClass}}>Green block</div>
                        <div>One more block</div>
                        <ol>
                            <%wb-for iterable={{$list}}%>
                                <li>item of the list</li>
                            <%/wb-for%>
                        </ol>
                    </div>
                <%/wb-if%>
            </div>
        </div>
    `
})
export class ModComponent {
    @State name = 'My super component';
    @State redClass = { redClass: true };
    @State greenClass = { greenClass: true };

    @Prop list: number[];
    @Prop show: boolean;

    constructor(private http: HTTPService) {
        // yo
    }

    wbInit(): void {
        console.log('mod-comp init');
    }

    wbViewInit(): void {
        console.log('mod-comp view init');
    }
}