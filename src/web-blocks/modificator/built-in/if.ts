import { VDomNode } from './../../vdom/virtual_dom';
import { Modificator } from "../decorator";
import { IModificator } from "../types";

interface WbIfProps {
    condition: boolean;
}

@Modificator({
    selector: 'if'
})
export class WbIfModificator implements IModificator {
    modify(renderContent: () => VDomNode, { condition }: WbIfProps): VDomNode|null {
        return condition ? renderContent() : null;
    }
}