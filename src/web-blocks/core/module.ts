import { IModificator } from "../modificator";
import { ConstructorClass } from "./types";

class WbGlobalModule {
    private components: Map<string, ConstructorClass> = new Map();
    private modificators: Map<string, IModificator> = new Map();
    private filters: Map<string, ConstructorClass> = new Map();

    registerComponent(name: string, compClass: ConstructorClass): void {
        if (this.isEntityRegistered(name, 'C')) {
            throw new Error(`The component with the name "${name} already exists"`);
        }

        this.components.set(name, compClass);
    }

    getComponent(name: string): ConstructorClass {
        if (!this.isEntityRegistered(name, 'C')) {
            throw new Error(`The component with the name "${name} has not registered"`);
        }

        return this.components.get(name);
    }

    registerModificator(name: string, modFunc: IModificator): void {
        if (this.isEntityRegistered(name, 'M')) {
            throw new Error(`The modificator with the name "${name} already exists"`);
        }

        this.modificators.set(name, modFunc);
    }

    getModificator(name: string): IModificator {
        if (!this.isEntityRegistered(name, 'M')) {
            throw new Error(`The modificator with the name "${name} has not registered"`);
        }

        return this.modificators.get(name);
    }

    registerFilter(name: string, filterClass: ConstructorClass): void {
        if (this.isEntityRegistered(name, 'F')) {
            throw new Error(`The filter with the name "${name} already exists"`);
        }

        this.filters.set(name, filterClass);
    }

    getFilter(name: string): ConstructorClass {
        if (!this.isEntityRegistered(name, 'F')) {
            throw new Error(`The filter with the name "${name} has not registered"`);
        }

        return this.filters.get(name);
    }

    isEntityRegistered(name: string, type:'C'|'M'|'F'): boolean {
        let map: Map<string, unknown>;
        switch (type) {
            case 'C':
                map = this.components;
                break;
            case 'M':
                map = this.modificators;
                break;
            case 'F':
                map = this.filters;
                break;
        }

        return map.has(name);
    }
}

export const wbModule = new WbGlobalModule();