import { Service } from "../../web-blocks/core";
import { Inject, forwardRef } from "../../web-blocks/di";
import { DataService } from "./service";

@Service()
export class HTTPService {

    constructor(private data: DataService, @Inject(forwardRef(() => NewService)) private newService: NewService) {}

    get(): void {
        console.log('http-get');
    }
    post(): void {
        console.log('http-post');
    }
    put(): void {
        console.log('http-put');
    }
    delete(): void {
        console.log('http-delete');
    }
}

@Service()
export class NewService {
    constructor() {
        // new service
    }
}