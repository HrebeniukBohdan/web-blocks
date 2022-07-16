import { wbModule } from './module';
import { RenderComp } from "./../Component";
import { h, VNode, VNodeChildren, VNodeData } from 'snabbdom/build';

export function renderWebBlock(sel: string, data: VNodeData | null, children: VNodeChildren): VNode {
    if (sel.includes('wb-')) {
        return RenderComp(wbModule.getComponent(sel), data);
    }
    
    return h(sel, data, children);
}