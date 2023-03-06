import { WbComponent } from './../vdom/component';
import { createComponent } from './../vdom/virtual_dom';
import { renderDOM } from './../vdom/render';
import { ComponentFactory, ConstructorClass, IModule } from './types'; 

class WbEngine {
    private running = false;

    constructor(private rootNodeName: string, private rootComponent: ConstructorClass) {}

    run(): void {
        if (this.running) {
            throw new Error('The render engine is already running.');
        }

        this.running = true;

        const rootComponentFactory: ComponentFactory = () => new WbComponent(this.rootComponent as any)
        renderDOM(this.rootNodeName, createComponent(rootComponentFactory, {key: 'L'}))
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