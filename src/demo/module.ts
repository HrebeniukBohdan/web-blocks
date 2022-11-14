import { WbNothingModificator } from './mod';
import { WbModule } from "../web-blocks/core";
import { ModComponent, RootComponent } from "./Component";
import { DataService } from "./serv1";
import { HTTPService, NewService } from "./services";

@WbModule({
    root: RootComponent,
    blocks: [
        ModComponent
    ],
    modificators: [
        WbNothingModificator
    ],
    services: [
        DataService,
        NewService,
        HTTPService
    ],
})
export class AppModule {}