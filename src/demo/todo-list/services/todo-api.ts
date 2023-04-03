import { TodoTaskData } from './../../debug_example/types';
import { Service } from "../../../web-blocks/core";
import { UtilService } from './utils';

@Service()
export class TodoApiService {

    private currentId = 5;
    private tasks: TodoTaskData[] = [
        { id: 0, text: '1. Hit the gym', done: false },
        { id: 1, text: '2. Pay bills', done: false },
        { id: 2, text: '3. Meet George', done: false },
        { id: 3, text: '4. Buy eggs', done: false },
        { id: 4, text: '5. Make your own Angular', done: true }
    ];
    
    constructor(private utilService: UtilService) {}

    getTodoTaskList(): Promise<TodoTaskData[]> {
      return this.utilService.delay().then(() => this.tasks);
    }

    addNewTodoTask(textValue: string): Promise<TodoTaskData[]> {
      return this.utilService.delay().then(
        () => {
            this.tasks = [
                ...this.tasks,
                {
                    id: this.currentId,
                    text: `${this.currentId + 1}. ${textValue}`,
                    done: false
                }
            ];

            this.currentId++;
            return this.tasks;
        }
      );
    }

    removeTodoTask(id: number): Promise<TodoTaskData[]> {
      return this.utilService.delay().then(
        () => {
          this.tasks = this.tasks.filter(task => task.id !== id);
          return this.tasks;
        }
      );
    }

    changeTodoTaskStatus(id: number): Promise<TodoTaskData[]> {
      return this.utilService.delay().then(
        () => {
          const taskIndex = this.tasks.findIndex(task => task.id === id);
          const task = this.tasks[taskIndex];
          this.tasks = Object.assign(
              [] as TodoTaskData[],
              this.tasks,
              { [taskIndex]:{ ...task, done: !task.done } }
          );
          return this.tasks;
        }
      );
    }
}