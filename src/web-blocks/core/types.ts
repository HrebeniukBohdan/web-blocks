export interface KeyValueMap {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export type ConstructorClass = {
    new(...args: any[]): any; 
};