import { Inject, Service } from "./Component";
import { DataService } from "./serv1";
import { forwardRef } from "./core/utils";


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