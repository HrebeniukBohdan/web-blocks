const componentStack: unknown[] = [];
const componentsToDestroy = [] as number[];
let posIndex = 0;

export type ComponentFactory<T> = (destroyComponent: () => void) => T;

export const useComponent = <T>(componentFactory: ComponentFactory<T>): [T, () => void] => {
    const currentPosIndex = posIndex;
    const component = componentStack[currentPosIndex];
    posIndex++;

    const removeComponent = () => { componentsToDestroy.push(currentPosIndex) };

    if (component === undefined) {
        componentStack[currentPosIndex] = componentFactory(removeComponent);
    }

    return [componentStack[currentPosIndex] as T, removeComponent];
}

export function resetComponentIndex(): void {
    posIndex = 0;
}

export function removeDestroyedComponents(): void {
    while (componentsToDestroy.length > 0) {
        const index = componentsToDestroy.pop();
        componentStack.splice(index, 1);
    }
    console.log(componentStack);
}