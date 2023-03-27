import { unmountNestedComponents } from "./utils";
import { VDOMAttributes, VDomNode } from "./virtual_dom";

type AttributesUpdater = {
  set: VDOMAttributes
  remove: string[]
}

interface InsertOperation {
  kind: 'insert', 
  node: VDomNode
}

interface UpdateOperation {
  kind: 'update',
  attributes: AttributesUpdater,
  childeren: ChildUpdater[]
}

interface ReplaceOperation {
  kind: 'replace',
  newNode: VDomNode
  callback?: (elem: HTMLElement | Text | Comment) => void
}

interface RemoveOperation {
  kind: 'remove'
}

interface ReorderOperation {
  kind: 'reorder',
  offset: number
}

interface SkipOperation {
  kind: 'skip'
}

export type VDomNodeUpdater = 
  | UpdateOperation
  | ReplaceOperation
  | SkipOperation
  
export type ChildUpdater =
  | UpdateOperation
  | ReplaceOperation
  | RemoveOperation
  | ReorderOperation
  | SkipOperation
  | InsertOperation

const skip = (): SkipOperation => ({ kind: 'skip' })

const replace = (newNode: VDomNode): ReplaceOperation => ({ kind: 'replace', newNode })

const update = (attributes: AttributesUpdater, childeren: ChildUpdater[]): UpdateOperation => ({ 
   kind: 'update',
   attributes,
   childeren
})

const remove = (): RemoveOperation => ({ kind: 'remove' })

const reorder = (offset: number): ReorderOperation => ({ kind: 'reorder', offset })

const insert = (node: VDomNode): InsertOperation => ({ kind: 'insert', node })

const isEqual = (comparableItemNames: string[], val1: any, val2: any): boolean => {
  return !comparableItemNames.some(propName => val1[propName] !== val2[propName]);
}

export const createDiff = (oldNode: VDomNode, newNode: VDomNode): VDomNodeUpdater => {
  // skip over text nodes with the same text
  if ((oldNode.kind == 'text' && newNode.kind == 'text' && oldNode.value == newNode.value)
        || (oldNode.kind == 'comment' && newNode.kind == 'comment' && oldNode.value == newNode.value)) 
  {
    return skip()
  }

  // If a textnode is updated we need to replace it completly
  if (oldNode.kind == 'text' || newNode.kind == 'text' || oldNode.kind == 'comment' || newNode.kind == 'comment') {
    return replace(newNode)
  }

  if(oldNode.kind == 'component' && newNode.kind == 'component' && oldNode.componentFactory == newNode.componentFactory && oldNode.instance) {
    newNode.instance = oldNode.instance
    if(isEqual(oldNode.instance.ωß_SIGNAL_PROP_NAMES, oldNode.props, newNode.props)) { 
      return skip()
    }
    return newNode.instance.setProps(newNode.props)
  }

  if(oldNode.kind == 'component') {
    oldNode.instance.unmount()
    oldNode.instance = null
    return replace(newNode)
  }
  
  // replace with different component
  if(newNode.kind == 'component') {
    oldNode.kind === 'element' && unmountNestedComponents(oldNode);
    newNode.instance = newNode.componentFactory()
    return { 
      kind: 'replace', 
      newNode: newNode.instance.initProps(newNode.props),
      callback: e => newNode.instance.notifyMounted(e)
    }
  }

  // If the tagname of a node is changed we have to replace it completly
  if (oldNode.tagname != newNode.tagname) {
    unmountNestedComponents(oldNode);
    return replace(newNode)
  }

  // get the updated and replaces attributes
  const attUpdater: AttributesUpdater = {
    remove: Object.keys(oldNode.props || {})
      .filter(att => Object.keys(newNode.props || {}).indexOf(att) == -1),
    set: Object.keys(newNode.props || {})
      .filter(att => oldNode.props[att] != newNode.props[att])
      .reduce((upd, att) => ({ ...upd, [att]: newNode.props[att] }), {})
  }

  const childsUpdater: ChildUpdater[] = childsDiff((oldNode.children || []), (newNode.children || []))

  return update(attUpdater, childsUpdater)
}

const removeUntilkey = (operations: ChildUpdater[], elems: [string | number, VDomNode][], key: string | number) => {
  while(elems[0] && elems[0][0] != key) {
    if(elems[0][1].kind == 'component') {
      elems[0][1].instance.unmount()
      elems[0][1].instance = null
    } else
    if (elems[0][1].kind === 'element') {
      unmountNestedComponents(elems[0][1]);
    }

    operations.push(remove())
    elems.shift()
  }
}

const insertOrReorderUntilKey = (
  operations: ChildUpdater[],
  oldElems: [string | number, VDomNode][],
  newElems: [string | number, VDomNode][],
  key: string | number
) => {
  while(newElems[0] && newElems[0][0] != key) {
    const currentElemKey = newElems[0][0];
    const fromIndex = oldElems.findIndex(
      (elem, index) => index && elem[0] === currentElemKey
    );

    if (fromIndex > 0) {
      operations.push(reorder(fromIndex));
      operations.push(createDiff(oldElems.splice(fromIndex, 1)[0][1], newElems.shift()[1]));
    } else {
      operations.push(insert(newElems.shift()[1]));
    }
  }
}

const childsDiff = (oldChilds: VDomNode[], newChilds: VDomNode[]): ChildUpdater[] => {
  const remainingOldChilds: [string | number, VDomNode][] = oldChilds.map(c => [c.key, c])
  const remainingNewChilds: [string | number, VDomNode][] = newChilds.map(c => [c.key, c])

  const operations: ChildUpdater[] = []

  // find the first element that got updated
  let [ nextUpdateKey ] = remainingOldChilds.find(k => remainingNewChilds.map(k => k[0]).indexOf(k[0]) != -1) || [null]

  while(nextUpdateKey !== null) {

    // first remove all old childs before the update
    removeUntilkey(operations, remainingOldChilds, nextUpdateKey)
    
    // then insert all new childs before the update
    insertOrReorderUntilKey(operations, remainingOldChilds, remainingNewChilds, nextUpdateKey)

    // create the update
    operations.push(createDiff(remainingOldChilds.shift()[1], remainingNewChilds.shift()[1]))

    // find the next update
    ; [ nextUpdateKey ] = remainingOldChilds.find(k => remainingNewChilds.map(k => k[0]).indexOf(k[0]) != -1) || [null]
  }

  // remove all remaing old childs after the last update
  removeUntilkey(operations, remainingOldChilds, undefined)

  // insert all remaing new childs after the last update
  insertOrReorderUntilKey(operations, remainingOldChilds, remainingNewChilds, undefined)

  return operations
}