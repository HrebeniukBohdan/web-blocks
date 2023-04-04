import { createComment, VDomNode } from './../../vdom/virtual_dom';
import { KeyValueMap } from './../../core/types';
import { Modificator } from "../decorator";
import { IModificator, IScope } from "../types";
import { VDomNodeChildren } from '../../vdom/h';

interface WbForProps {
    iterable: Array<unknown>;
    currentValueName?: string;
    currentIndexName?: string;
    trackBy?: string
}

const CURRENT_VALUE_NAME = 'current';
const CURRENT_INDEX_NAME = 'index';

@Modificator({
    selector: 'for'
})
export class WbForModificator implements IModificator {
    modify(
        renderContent: () => VDomNode,
        { iterable, currentValueName, currentIndexName, trackBy }: WbForProps,
        scope: IScope
    ): VDomNodeChildren {
        const iterList = iterable || [];
        const valName = currentValueName || CURRENT_VALUE_NAME;
        const indName = currentIndexName || CURRENT_INDEX_NAME;
        const result: VDomNodeChildren = [];
        let currentRenderedElem: VDomNode;

        scope[indName] = 0;

        for (const iterator of iterList) {
            scope[valName] = iterator;

            currentRenderedElem = renderContent();
            currentRenderedElem.key = 
                this.isTrackBy(iterator, trackBy) ?? scope[indName];
            result.push(currentRenderedElem);

            scope[indName] = scope[indName] + 1;
        }

        console.log(result);
        result.unshift(createComment(' wb-for '))
        result.push(createComment(' wb-for-end '))
        return result;
    }

    private isTrackBy(iter: unknown, trackBy?: string): boolean {
        return typeof iter === 'object' && trackBy && (iter as KeyValueMap)[trackBy];
    }
}