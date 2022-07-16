import { VNode, VNodeChildren } from "snabbdom/build";
import { wbModule } from "../../core/module";
import { IModificator, IScope } from "../types";

interface WbForProps {
    iterable: Array<unknown>;
    currentValueName?: string;
    currentIndexName?: string;
}

const CURRENT_VALUE_NAME = 'current';
const CURRENT_INDEX_NAME = 'index';

export const wbForModificator: IModificator = function(
    renderContent: () => VNode,
    { iterable, currentValueName, currentIndexName }: WbForProps,
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
        currentRenderedElem.key = scope[indName];
        result.push(currentRenderedElem);

        scope[indName] = scope[indName] + 1;
    }

    return result.length > 0 ? result : null;
}

wbModule.registerModificator('wb-for', wbForModificator);