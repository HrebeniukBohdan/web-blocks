import { VNode } from "snabbdom/build";

export function wbIf(cond: boolean, node: VNode): VNode|null {
    return cond ? node : null;
}