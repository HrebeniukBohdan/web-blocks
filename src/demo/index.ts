import { runModule } from "../web-blocks/core";
//import { ExampleModule } from "./example/module";
//import { DebugExampleModule } from "./debug_example/module";
import { TodoModule } from "./todo-list/module";

runModule("root", TodoModule);
//runModule("root", DebugExampleModule);
//runModule("root", ExampleModule);