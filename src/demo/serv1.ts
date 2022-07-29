import { Service } from "../web-blocks/core";

@Service()
export class DataService {

    // constructor(private http: HTTPService) {}

    getData(): void {
        console.log('data-serv-get-data');
    }
}