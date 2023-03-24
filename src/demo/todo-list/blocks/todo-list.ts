import { State, WbInit, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-list',
    template: `
        <div class="header">
            <h2>My To Do List</h2>
            <input type="text" placeholder="Title..." value={{$textValue}} @change={{$onTextChange($$event)}} />
            <span @click={{$newElement()}} class="addBtn">Add</span>
        </div>

        <!-- Items list -->
        <ul>
            <%wb-for iterable={{$sortedTasks()}} trackBy='id' %>
                <wb-todo-item 
                    data={{$current}}
                    @close={{$removeTask($$event)}}
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
    @State textValue = '';

    currentId = 5;

    wbInit(): void {
        console.log(this);
    }

    wbChange(): void {
        console.log('wb change list');
        console.log(this.tasks);
    }

    onTextChange(event: any): void {
        console.log(event);
        this.textValue = event.target.value;
    }

    newElement(): void {
        if (this.textValue) {
            this.tasks = [
                ...this.tasks,
                {
                    id: this.currentId,
                    text: this.textValue,
                    done: false
                }
            ];

            this.currentId++;
            this.textValue = '';
        }
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

    removeTask(id: number): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    changeItemStatus(id: number): void {
        console.log('Clicked on = ' + (id + 1));
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        const task = this.tasks[taskIndex];
        this.tasks = Object.assign(
            [] as TodoTaskData[],
            this.tasks,
            { [taskIndex]:{ ...task, done: !task.done } }
        );
    }
}