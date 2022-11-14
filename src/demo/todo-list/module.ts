import { WbModule } from "../../web-blocks/core";
import { TodoItem } from "./blocks/todo-item";
import { TodoList } from "./blocks/todo-list";

@WbModule({
    root: TodoList,
    blocks: [TodoItem]
})
export class TodoModule {}