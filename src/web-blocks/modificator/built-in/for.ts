import { KeyValueMap } from './../../core/types';
import { VNode, VNodeChildren } from "snabbdom/build";
import { Modificator } from "../decorator";
import { IModificator, IScope } from "../types";

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
        renderContent: () => VNode,
        { iterable, currentValueName, currentIndexName, trackBy }: WbForProps,
        scope: IScope
    ): VNodeChildren|null {
        const iterList = iterable || [];
        const valName = currentValueName || CURRENT_VALUE_NAME;
        const indName = currentIndexName || CURRENT_INDEX_NAME;
        const result: VNodeChildren = [];
        let currentRenderedElem: VNode;

        scope[indName] = 0;

        for (const iterator of iterList) {
            scope[valName] = iterator;

            currentRenderedElem = renderContent();
            currentRenderedElem.key = 
                this.isTrackBy(iterator, trackBy) ? 
                    (iterator as KeyValueMap)[trackBy] : scope[indName];
            result.push(currentRenderedElem);

            scope[indName] = scope[indName] + 1;
        }

        return result.length > 0 ? result : null;
    }

    private isTrackBy(iter: unknown, trackBy?: string): boolean {
        return typeof iter === 'object' && trackBy && (iter as KeyValueMap)[trackBy];
    }
}