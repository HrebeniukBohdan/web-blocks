import { VDomNode } from './../web-blocks/vdom/virtual_dom';
import { IModificator } from './../web-blocks/modificator/types';
import { HTTPService } from './services';
import { Modificator } from './../web-blocks/modificator/decorator';

interface WbNothingProps {
    some: boolean;
}

@Modificator({
    selector: 'nothing'
})
export class WbNothingModificator implements IModificator {

    constructor(private http: HTTPService) {
        console.log(http);
    }

    modify(renderContent: () => VDomNode, { some }: WbNothingProps): VDomNode|null {
        return renderContent();
    }
}