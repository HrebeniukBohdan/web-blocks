import { WbComponent } from './component'

const defaultKey = 'dkey'

export type VDOMAttributes = { [attrName: string]: string | number | boolean | Function }

export interface VDOMElement {
  kind: 'element'
  tagname: string
  childeren?: VDomNode[]
  props?: VDOMAttributes
  key?: string
}

export interface VDOMComponent {
  kind: 'component'
  instance?: WbComponent<any, any>
  props: object
  componentFactory: () => WbComponent<any, any>
  key?: string
}

export interface VDOMText {
  kind: 'text',
  value: string
  key?: string
}

export type VDomNode = 
  | VDOMText
  | VDOMElement
  | VDOMComponent

export const createElement = (tagname: string, props: VDOMAttributes & { key?: string }, childeren: VDomNode[] = []): VDOMElement => {
  const key = props.key || defaultKey
  delete props.key
  return ({ kind: 'element', tagname, props, childeren, key })
}

export const createComponent = <P extends object>(componentFactory: () => WbComponent<P, any>, props: P & { key?: string }): VDOMComponent => {
  const key = props.key || defaultKey
  delete props.key
  return ({
    componentFactory, props, key, kind: 'component'
  })  
}

export const createText = (value: string | number | boolean, key: string = '') : VDOMText => ({
  key, kind: 'text', value: value.toString()
})