import { VDomNode } from '../vdom/virtual_dom';
import { wbModule } from './module';
import { c, h, VDomNodeChildren } from '../vdom/h';

type Attrs = Record<string, string | number | boolean>;
type Listener<T> = (this: VDomNode, ev: T, vnode: VDomNode) => void;
type On = {
  [N in keyof HTMLElementEventMap]?:
    | Listener<HTMLElementEventMap[N]>
    | Array<Listener<HTMLElementEventMap[N]>>;
} & {
  [event: string]: Listener<any> | Array<Listener<any>>;
};

export function renderWebBlock(sel: string, props?: Attrs | null, eventBindings?: On | null, children?: VDomNodeChildren): VDomNode {
    if (sel.includes('wb-')) {
        const compProps: any = { ...(props || {}), ...(eventBindings || {}) };
        return c(wbModule.getComponentFactory(sel), compProps);
    }
    
    const data: any = { props: props || {}, on: eventBindings as any || {} };
    return h(sel, data, children);
}