import { VDOMAttributes, VDomNode } from '../vdom/virtual_dom';
import { Signals } from './types';
import { wbModule } from './module';
import { Attrs, On} from 'snabbdom/build';
import { c, h, VDomNodeChildren } from '../vdom/h';

export function renderWebBlock(sel: string, props?: Attrs | null, eventBindings?: On | null, children?: VDomNodeChildren): VDomNode {
    if (sel.includes('wb-')) {
        const compProps: any = { ...(props || {}), ...(eventBindings || {}) };
        return c(wbModule.getComponentFactory(sel), compProps);
    }
    
    const data: any = { props: props || {}, on: eventBindings as any || {} };
    return h(sel, data, children);
}