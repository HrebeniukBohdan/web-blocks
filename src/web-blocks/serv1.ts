import { Service } from "./Component";
// import { HTTPService } from "./services";

@Service()
export class DataService {

    // constructor(private http: HTTPService) {}

    getData(): void {
        console.log('data-serv-get-data');
    }
}