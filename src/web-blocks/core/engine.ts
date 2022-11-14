import { ConstructorClass, IModule } from './types'; 
import {
    init,
    attributesModule,
    eventListenersModule,
    VNode,
} from 'snabbdom/build';
import { removeDestroyedComponents, resetComponentIndex } from './useComponent';
import { RenderComp } from './render';
  
  const patch = init([
    // Init patch function with chosen modules
    // classModule, // makes it easy to toggle classes
    // propsModule, // for setting properties on DOM elements
    // styleModule, // handles styling on elements with support for animations
    attributesModule,
    eventListenersModule, // attaches event listeners
  ]);

class WbEngine {
    private static timeout = 20;
    private prevNode: HTMLElement | VNode;
    private stateChangesCount = 10;
    private running = false;

    constructor(rootNodeName: string, private rootComponent: ConstructorClass) {
        this.prevNode = document.getElementById(rootNodeName)
    }

    run(): void {
        if (this.running) {
            throw new Error('The render engine is already running.');
        }

        this.running = true;

        this.render();
        setInterval(() => {
            this.render();
        }, WbEngine.timeout);
    }
    
    markStateChanged() {
        this.stateChangesCount = this.stateChangesCount + 1;
    }

    private render() {
        if (this.isStateChanged()) {
            console.log('Render is started!');
            // render
            const node = RenderComp(this.rootComponent, {});
            resetComponentIndex();
            patch(this.prevNode, node);
            removeDestroyedComponents();
            this.prevNode = node;
            this.resetStateChanged();
            console.log('Render is done!');
        }
    }

    private isStateChanged(): boolean {
        return this.stateChangesCount > 0;
    }

    private resetStateChanged(): void {
        this.stateChangesCount = 0;
    }
}

let engine: WbEngine;

export function runEngine(rootNodeName: string, rootComponent: ConstructorClass): void {
    if (engine) {
        throw new Error('The web-blocks engine is already running.');
    }

    engine = new WbEngine(rootNodeName, rootComponent);
    engine.run();
}

export function runModule(rootNodeName: string, module: ConstructorClass): void {
    if (engine) {
        throw new Error('The web-blocks engine is already running.');
    }

    engine = new WbEngine(rootNodeName, (module as IModule).ωß_root);
    engine.run();
}

export function markStateChanged(): void {
    if (!engine) {
        throw new Error('The web-blocks engine is not running. Run the engine first');
    }
    
    engine.markStateChanged();
}