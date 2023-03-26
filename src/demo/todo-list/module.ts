import { WbModule } from "../../web-blocks/core";
import { TodoItem } from "./blocks/todo-item";
import { TodoList } from "./blocks/todo-list";
import { TaskSortFilter } from "./filters/task-sort";

@WbModule({
    root: TodoList,
    blocks: [TodoItem],
    filters: [TaskSortFilter]
})
export class TodoModule {}