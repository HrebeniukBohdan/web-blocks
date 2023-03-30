import { WbModule } from "../../web-blocks/core";
import { TodoFilterSwitch } from "./blocks/todo-filter";
import { TodoItem } from "./blocks/todo-item";
import { TodoList } from "./blocks/todo-list";
import { TaskSortFilter } from "./filters/task-sort";

@WbModule({
    root: TodoList,
    blocks: [
        TodoItem,
        TodoFilterSwitch
    ],
    filters: [TaskSortFilter]
})
export class TodoModule {}