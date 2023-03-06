import { State, WbInit, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-list',
    template: `
        <ul>
            <%wb-for iterable={{$sortedTasks()}} trackBy='id' %>
                <wb-todo-item 
                    data={{$current}}
                    @statusChange={{$changeItemStatus($$event)}}
                />
            <%/wb-for%>
        </ul>
    `
})
export class TodoList implements WbInit {
    @State tasks: TodoTaskData[] = [
        { id: 0, text: '1. Hit the gym', done: false },
        { id: 1, text: '2. Pay bills', done: false },
        { id: 2, text: '3. Meet George', done: false },
        { id: 3, text: '4. Buy eggs', done: false },
        { id: 4, text: '5. Make your own Angular', done: true }
    ];

    wbInit(): void {
        console.log(this);
    }

    wbChange(): void {
        console.log('wb change list');
        console.log(this.tasks);
    }

    sortedTasks(): TodoTaskData[] {
        const array = [...this.tasks].sort((aTask, bTask) => {
            if (!aTask.done && bTask.done) return -1;
            if (aTask.done && !bTask.done) return 1;
            return 0;
        });
        console.log('Sorted');
        console.log(array);
        return array;
    }

    changeItemStatus(taskData: TodoTaskData): void {
        console.log('Clicked on = ' + (taskData.id + 1));
        const taskIndex = this.tasks.findIndex(task => task.id === taskData.id);
        const task = this.tasks[taskIndex];
        this.tasks = Object.assign(
            [] as TodoTaskData[],
            this.tasks,
            { [taskIndex]:{ ...task, done: !task.done } }
        );
    }
}