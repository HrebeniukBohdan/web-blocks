import { VDomNode } from './../../../web-blocks/vdom/virtual_dom';
import { IModificator } from './../../../web-blocks/modificator/types';
import { Modificator } from '../../../web-blocks/modificator/decorator';


interface WbUnlessProps {
    condition: boolean;
}

@Modificator({
    selector: 'unless'
})
export class WbUnlessModificator implements IModificator {
    modify(renderContent: () => VDomNode, { condition }: WbUnlessProps): VDomNode|null {
        return condition ? null : renderContent();
    }
}