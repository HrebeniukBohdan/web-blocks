import { WbModule } from "../../web-blocks/core";
import { TodoFilterSwitch } from "./blocks/todo-filter";
import { TodoItem } from "./blocks/todo-item";
import { TodoList } from "./blocks/todo-list";
import { TodoOptionButton } from "./blocks/todo-option-button";
import { TaskSortFilter } from "./filters/task-sort";
import { WbUnlessModificator } from "./modificators/unless";
import { TodoApiService } from "./services/todo-api";
import { UtilService } from "./services/utils";

@WbModule({
    root: TodoList,
    blocks: [
        TodoItem,
        TodoOptionButton,
        TodoFilterSwitch
    ],
    modificators: [
        WbUnlessModificator
    ],
    services: [
        UtilService,
        TodoApiService
    ],
    filters: [TaskSortFilter]
})
export class TodoModule {}