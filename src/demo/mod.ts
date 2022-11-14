import { IModificator } from './../web-blocks/modificator/types';
import { HTTPService } from './services';
import { VNode } from "snabbdom/build";
import { Modificator } from './../web-blocks/modificator/decorator';

interface WbNothingProps {
    some: boolean;
}

@Modificator({
    selector: 'nothing'
})
export class WbNothingModificator implements IModificator {

    constructor(private http: HTTPService) {
        console.log('ffgkdfgjdfgjkdfgdflgkdfgkldfgkldfklgfkldfgkdfgklk');
        console.log(http);
    }

    modify(renderContent: () => VNode, { some }: WbNothingProps): VNode|null {
        return renderContent();
    }
}