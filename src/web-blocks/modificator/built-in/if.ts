import { VNode } from "snabbdom/build";
import { Modificator } from "../decorator";
import { IModificator } from "../types";

interface WbIfProps {
    condition: boolean;
}

@Modificator({
    selector: 'if'
})
export class WbIfModificator implements IModificator {
    modify(renderContent: () => VNode, { condition }: WbIfProps): VNode|null {
        return condition ? renderContent() : null;
    }
}