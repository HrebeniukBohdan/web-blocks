import { Service } from "../../../web-blocks/core";

@Service()
export class UtilService {

    private readonly DELAY_TIMEOUT = 200;

    delay(): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), this.DELAY_TIMEOUT + Math.random() * this.DELAY_TIMEOUT);
      });
    }
}