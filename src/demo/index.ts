//import { RootComponent } from './Component';
//import { WbNothingModificator } from './mod';
import { runModule } from "../web-blocks/core";
//import { AppModule } from "./module";
import { TodoModule } from "./todo-list/module";

runModule("root", TodoModule);