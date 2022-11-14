import { State, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-list',
    template: `
        <div class="header">
            <h2>My To Do List</h2>
            <input type="text" placeholder="Title..." value={{$textValue}} @change={{$onTextChange($$event)}} />
            <span @click={{$newElement()}} class="addBtn">Add</span>
        </div>

        <ul>
            <%wb-for iterable={{$tasks}} trackBy='id' %>
                <wb-todo-item data={{$current}} @close={{$removeTask($$event)}} />
            <%/wb-for%>
        </ul>
    `
})
export class TodoList {
    @State tasks: TodoTaskData[] = [
        { id: 0, text: 'Hit the gym', done: false },
        { id: 1, text: 'Pay bills', done: false },
        { id: 2, text: 'Meet George', done: false },
        { id: 3, text: 'Buy eggs', done: false },
        { id: 4, text: 'Make your own Angular', done: true }
    ];
    @State textValue = 'yo';

    currentId = 5;

    onTextChange(event: any): void {
        console.log(event);
        this.textValue = event.target.value;
    }

    newElement(): void {
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

    removeTask(id: number): void {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}