import { VNode } from "snabbdom/build";
import { wbModule } from "../../core/module";
import { IModificator } from "../types";

interface WbIfProps {
    condition: boolean;
}

export const wbIfModificator: IModificator = function(
    renderContent: () => VNode,
    { condition }: WbIfProps
): VNode|null {
    return condition ? renderContent() : null;
}

wbModule.registerModificator('wb-if', wbIfModificator);