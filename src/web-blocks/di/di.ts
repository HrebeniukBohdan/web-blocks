import { ForwardedType } from "./decorator";

export interface InjectableType {
    ωß_INJECT: Array<InjectableType|ForwardedType>;
    new(...args: any[]): any;
    name: string;
}

interface Dependency {
    type: InjectableType;
    deps: Array<InjectableType|ForwardedType>;
    singleton: boolean;
    instance?: any;
}

class DependencyInjector {
    private container = new WeakMap<InjectableType|ForwardedType, Dependency>();

    register(type: InjectableType, singleton = true): void {
        if (this.container.has(type)) {
            throw new Error(`The type "${type.name}" is already registered`)
        } else {
            this.container.set(type, {
                type, deps: type.ωß_INJECT, singleton
            })
        }

        console.log(this.container);
    }

    get(type: InjectableType): any {
        return this.resolveAndCreate(type);
    }

    private resolveAndCreate(
        type: InjectableType|ForwardedType,
        duplicateStorage: Map<InjectableType, InjectableType> = undefined): any 
    {
        let resolvedType: InjectableType;
        if ((type as ForwardedType).isForwardRef) {
            const ref: () => InjectableType = type as any;
            resolvedType = ref();
        } else {
            resolvedType = type as InjectableType;
        }

        if (!this.container.has(resolvedType)) {
            throw new Error(`The type "${resolvedType.name}" is not registered.`);
        }

        const dep = this.container.get(resolvedType);

        if (dep.singleton && dep.instance) {
            return dep.instance;
        }

        const dupStorage = duplicateStorage || new Map<InjectableType, InjectableType>();
        const DepType = dep.type;
        DepType.ωß_INJECT.forEach(depType => this.checkCircularDependecy(resolvedType, depType, dupStorage));

        const depArguments = DepType.ωß_INJECT.map(depType => this.resolveAndCreate(depType, dupStorage));
        const instance = new DepType(...depArguments);

        if (dep.singleton) {
            dep.instance = instance;
        }

        return instance;
    }

    private checkCircularDependecy(
        hostType: InjectableType|ForwardedType,
        type: InjectableType|ForwardedType,
        dupStorage: Map<InjectableType|ForwardedType, InjectableType|ForwardedType>) 
    {
        if (type === undefined) {
            throw new Error(
                `The type "${hostType.name}" is probably using as a dependency class that defined after the current one. 
                In order to fix it please use the construction in the constructor: 
                  @Inject(forwardRef(() => YourDependencyClass))
                `
            );
        }

        if (dupStorage.has(type)) {
            throw new Error(`Circular dependency is detected: "${hostType.name}" <--> "${type.name}"`);
        }

        dupStorage.set(type, type);
    }
}

const diContainer = new DependencyInjector();

export const registerDependency = (type: InjectableType, singleton = true): void => {
    diContainer.register(type, singleton);
}

export const injectDependency = (type: InjectableType): any => {
    return diContainer.get(type);
}