import { VDomNode } from "./virtual_dom";
import { ChildUpdater, VDomNodeUpdater } from "./diffs";

const renderElement = (rootNode: VDomNode): HTMLElement | Text | Comment => {
  if (rootNode.kind == 'text') {
    return document.createTextNode(rootNode.value)
  }

  if (rootNode.kind == 'comment') {
    return document.createComment(rootNode.value)
  }

  if(rootNode.kind == 'component') {
    if(rootNode.instance) {
      const elem = renderElement(rootNode.instance.render())
      rootNode.instance.notifyMounted(elem as HTMLElement)
      return elem
    }

    rootNode.instance = rootNode.componentFactory()
    const elem = renderElement(rootNode.instance.initProps(rootNode.props))
    rootNode.instance.notifyMounted(elem as HTMLElement)
    return elem
  }

  const elem = document.createElement(rootNode.tagname)

  for (const att in (rootNode.props || {})) {
    (elem as any)[att] = rootNode.props[att]
  }

  (rootNode.childeren || []).forEach(child =>
    elem.appendChild(renderElement(child))
  )

  return elem
}

export const applyUpdate = (elem: HTMLElement | Text | Comment, diff: VDomNodeUpdater): HTMLElement | Text | Comment => {
  if (diff.kind == 'skip') return elem 

  if (diff.kind == 'replace') {
    const newElem = renderElement(diff.newNode)
    elem.replaceWith(newElem)
    if(diff.callback) diff.callback(newElem)
    return newElem
  }

  if (elem instanceof Comment) {
    throw new Error('invalid update for Comment node');
  }
  
  if('wholeText' in elem) {
    throw new Error('invalid update for Text node');
  }

  const removeAttrList = diff.attributes.remove;
  for (let i = 0; i < removeAttrList.length; i++) {
    const attrName = removeAttrList[i];
    elem.removeAttribute(
      attrName === 'className' ? 'class' : attrName
    );
  }

  for (const att in diff.attributes.set) {
    (elem as any)[att] = diff.attributes.set[att]
  }

  applyChildrenDiff(elem, diff.childeren)

  return elem
}

const applyChildrenDiff = (elem: HTMLElement, operations: ChildUpdater[]) => {
  let offset = 0
  for (let i = 0; i < operations.length; i++) {
    const childUpdater = operations[i]

    if (childUpdater.kind == 'skip') continue

    if (childUpdater.kind == 'insert') {
      if (elem.childNodes[i + offset - 1]) {
        elem.childNodes[i + offset - 1].after(renderElement(childUpdater.node))
      } else {
        elem.prepend(renderElement(childUpdater.node))
      }
      continue
    }

    const childElem = elem.childNodes[i + offset]

    if (childUpdater.kind == 'reorder') {
      const targetElem = elem.childNodes[i + offset + childUpdater.offset];
      if (elem.childNodes[i + offset - 1]) {
        elem.childNodes[i + offset - 1].after(targetElem)
      } else {
        elem.prepend(targetElem)
      }
      applyUpdate(targetElem as HTMLElement, operations[++i] as VDomNodeUpdater)
      offset -= 1
      continue
    }

    if (childUpdater.kind == 'remove') {
      childElem.remove()
      offset -= 1
      continue
    }

    applyUpdate(childElem as HTMLElement, childUpdater)
  }
}

export const renderDOM = (htmlId: string, rootNode: VDomNode): HTMLElement => {
  const elem = document.getElementById(htmlId)
  if (elem == null) {
    throw new Error('Container elem is not found')
  }

  const parent = elem.parentElement

  elem.replaceWith(renderElement(rootNode))

  return parent.children[0] as HTMLElement
}