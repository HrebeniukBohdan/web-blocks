import { wbModule } from './module';
import { RenderComp } from "./../Component";
import { Attrs, h, On, VNode, VNodeChildren } from 'snabbdom/build';

export function renderWebBlock(sel: string, props: Attrs | null, eventBindings: On | null, children: VNodeChildren): VNode {
    if (sel.includes('wb-')) {
        return RenderComp(wbModule.getComponent(sel), props, eventBindings as any);
    }
    
    return h(sel, { attrs: props, on: eventBindings }, children);
}