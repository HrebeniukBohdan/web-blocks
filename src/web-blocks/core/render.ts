import { Props, Signals } from './types';
import { wbModule } from './module';
import { Attrs, h, On, VNode, VNodeChildren } from 'snabbdom/build';
import { ConstructorClass } from './types';
import { ComponentController } from './component';
import { useComponent } from './useComponent';

export const RenderComp = (componentType: ConstructorClass, props?: Props, signals?: Signals): VNode => {
    const [component] = useComponent(
        (remove: () => void) => new ComponentController(componentType as any, remove)
    );

    return component.ωß_render(props, signals);
}

export function renderWebBlock(sel: string, props?: Attrs | null, eventBindings?: On | null, children?: VNodeChildren): VNode {
    if (sel.includes('wb-')) {
        return RenderComp(wbModule.getComponent(sel), props, eventBindings as any);
    }
    
    return h(sel, { attrs: props || {}, on: eventBindings || {} }, children);
}