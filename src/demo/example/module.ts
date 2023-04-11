import { WbNothingModificator } from './modificator';
import { WbModule } from "../../web-blocks/core";
import { ModComponent, RootComponent } from "./component";
import { DataService } from "./service";
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
export class ExampleModule {}