import { WbComponent } from "./component";
import { isArray, isEmpty, isText } from "./utils";
import { VDomNode, createText, createElement, VDOMAttributes, VDOMComponent, createComponent, createComment } from "./virtual_dom";

interface GlobalEventHandlersEventMap {
  abort: UIEvent;
  animationcancel: AnimationEvent;
  animationend: AnimationEvent;
  animationiteration: AnimationEvent;
  animationstart: AnimationEvent;
  auxclick: MouseEvent;
  beforeinput: InputEvent;
  blur: FocusEvent;
  canplay: Event;
  canplaythrough: Event;
  change: Event;
  click: MouseEvent;
  close: Event;
  compositionend: CompositionEvent;
  compositionstart: CompositionEvent;
  compositionupdate: CompositionEvent;
  contextmenu: MouseEvent;
  cuechange: Event;
  dblclick: MouseEvent;
  drag: DragEvent;
  dragend: DragEvent;
  dragenter: DragEvent;
  dragleave: DragEvent;
  dragover: DragEvent;
  dragstart: DragEvent;
  drop: DragEvent;
  durationchange: Event;
  emptied: Event;
  ended: Event;
  error: ErrorEvent;
  focus: FocusEvent;
  focusin: FocusEvent;
  focusout: FocusEvent;
  formdata: FormDataEvent;
  gotpointercapture: PointerEvent;
  input: Event;
  invalid: Event;
  keydown: KeyboardEvent;
  keypress: KeyboardEvent;
  keyup: KeyboardEvent;
  load: Event;
  loadeddata: Event;
  loadedmetadata: Event;
  loadstart: Event;
  lostpointercapture: PointerEvent;
  mousedown: MouseEvent;
  mouseenter: MouseEvent;
  mouseleave: MouseEvent;
  mousemove: MouseEvent;
  mouseout: MouseEvent;
  mouseover: MouseEvent;
  mouseup: MouseEvent;
  pause: Event;
  play: Event;
  playing: Event;
  pointercancel: PointerEvent;
  pointerdown: PointerEvent;
  pointerenter: PointerEvent;
  pointerleave: PointerEvent;
  pointermove: PointerEvent;
  pointerout: PointerEvent;
  pointerover: PointerEvent;
  pointerup: PointerEvent;
  progress: ProgressEvent;
  ratechange: Event;
  reset: Event;
  resize: UIEvent;
  scroll: Event;
  securitypolicyviolation: SecurityPolicyViolationEvent;
  seeked: Event;
  seeking: Event;
  select: Event;
  selectionchange: Event;
  selectstart: Event;
  slotchange: Event;
  stalled: Event;
  submit: SubmitEvent;
  suspend: Event;
  timeupdate: Event;
  toggle: Event;
  touchcancel: TouchEvent;
  touchend: TouchEvent;
  touchmove: TouchEvent;
  touchstart: TouchEvent;
  transitioncancel: TransitionEvent;
  transitionend: TransitionEvent;
  transitionrun: TransitionEvent;
  transitionstart: TransitionEvent;
  volumechange: Event;
  waiting: Event;
  webkitanimationend: Event;
  webkitanimationiteration: Event;
  webkitanimationstart: Event;
  webkittransitionend: Event;
  wheel: WheelEvent;
}

interface DocumentAndElementEventHandlersEventMap {
  copy: ClipboardEvent;
  cut: ClipboardEvent;
  paste: ClipboardEvent;
}

interface ElementEventMap {
  fullscreenchange: Event;
  fullscreenerror: Event;
}

interface HTMLElementEventMap extends ElementEventMap, DocumentAndElementEventHandlersEventMap, GlobalEventHandlersEventMap { }

type NativeEventListener<T> = (event: T) => void;

function patchClassName(props: Props) {
  if (props.class) {
    props.className = props.class;
  }
  delete props.class;

  return props;
}

function dataToProps(data: VDomNodeData): VDOMAttributes {
  const props = data?.props || { };
  const events: ComponentEventHandlers = { };

  Object.entries(data?.on || { })
        .forEach(([eventName, handler]) => events[`on${eventName}`] = handler);

  const dataProps = { ...data, props: undefined, on: undefined } as any;
  delete dataProps.props;
  delete dataProps.on;

  return patchClassName({ ...dataProps, ...props, ...events });
}

export type ElementEventHandlers = {
  [N in keyof HTMLElementEventMap]?: NativeEventListener<HTMLElementEventMap[N]>;
};
export type ComponentEventHandlers = {
  [event: string]: NativeEventListener<any>;
}

export type Props = Record<string, any>;

export interface VDomNodeData {
  props?: Props;
  on?: ElementEventHandlers;
}

export type VDomNodes = VDomNode[];
export type VDomNodeChildElement =
  | VDomNode
  | string
  | number
  | boolean
  | String
  | Number
  | undefined
  | null;
export type ArrayOrElement<T> = T | T[];
export type VDomNodeChildren = ArrayOrElement<VDomNodeChildElement>;

export function h(sel: string): VDomNode;
export function h(sel: string, data: VDOMAttributes & VDomNodeData | null): VDomNode;
export function h(sel: string, children: VDomNodeChildren): VDomNode;
export function h(sel: string, data: VDOMAttributes & VDomNodeData | null, children: VDomNodeChildren): VDomNode;
export function h(sel: any, b?: any, c?: any): VDomNode {
  let data: VDOMAttributes & VDomNodeData = {};
  let children: any;
  let text: any;
  let i: number;

  if (c !== undefined) {
    if (b !== null) {
      data = b;
    }
    if (isArray(c)) {
      children = c;
    } else 
    if (isText(c)) {
      text = c.toString();
      children = [text];
    } else 
    if (c && c.kind) {
      children = [c];
    }
  } else 
  if (b !== undefined && b !== null) {
    if (isArray(b)) {
      children = b;
    } else 
    if (isText(b)) {
      text = b.toString();
      children = [text];
    } else 
    if (b && b.kind) {
      children = [b];
    } else {
      data = b;
    }
  }

  if (sel === '!' && data && isText(data.props)) {
    return createComment(data.props as any);
  }

  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (isText(children[i])) {
        children[i] = createText(children[i]);
      }
    }
  }
  
  return createElement(
    sel,
    dataToProps(data),
    children?.filter((c: any) => !isEmpty(c))
  );
}

export function c<P extends object>(componentFactory: () => WbComponent<P, any>, props: P & { key?: string }): VDOMComponent {
  return createComponent(componentFactory, props);
}
