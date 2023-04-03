import { VDOMComponent, VDOMElement } from "./virtual_dom";

export const isArray = Array.isArray;

export function isText(s: any): boolean {
  return (
    typeof s === "string" ||
    typeof s === "number" ||
    typeof s === "boolean"
  );
}

export function isEmpty(s: any): boolean {
  return (typeof s === 'undefined' || s === null);
}

export function unmountNestedComponents(elem: VDOMElement): void {
  for (let i = 0; i < elem.children.length; i++) {
    const vnode = elem.children[i];
    if (vnode.kind === 'component') {
      (vnode as VDOMComponent).instance.unmount();
      (vnode as VDOMComponent).instance = null;
    } else 
    if (vnode.kind === 'element') {
      unmountNestedComponents(vnode);
    }
  }
}
