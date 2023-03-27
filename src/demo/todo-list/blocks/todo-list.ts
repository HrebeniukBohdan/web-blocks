import { State, WbInit, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-list',
    template: `
        <div class="header">
            <h2>My To Do List</h2>
            <input 
                type="text"
                placeholder="Title..."
                value={{$textValue}}
                @keyup={{$onKeyup($$event)}}
                @change={{$onTextChange($$event)}}
            />
            <span @click={{$newElement()}} class="addBtn">Add Item</span>
            <span @click={{$switchVisibility()}} class="addBtn">Switch</span>
        </div>

        <!-- Items list -->
        <%wb-if condition={{$visible}}%>
            <ul>
                <%wb-for iterable={{$tasks|taskSort}} trackBy='id' %>
                    <wb-todo-item 
                        data={{$current}}
                        @close={{$removeTask($$event)}}
                        @statusChange={{$changeItemStatus($$event)}}
                    />
                <%/wb-for%>
            </ul>
        <%/wb-if%>
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

    @State visible = false;

    switchVisibility(): void {
        this.visible = !this.visible;
    }

    wbInit(): void {
        console.log(this);
    }

    wbChange(): void {
        console.log('wb change list');
        console.log(this.tasks);
    }

    wbDestroy(): void {
        console.log('wb destroy list');
    }

    onTextChange(event: any): void {
        this.textValue = event.target.value;
    }

    onKeyup(event: KeyboardEvent): void {
        if (event.code === 'Enter') {
            event.preventDefault();
            this.newElement();
        }
    }

    newElement(): void {
        if (this.textValue) {
            this.tasks = [
                ...this.tasks,
                {
                    id: this.currentId,
                    text: `${this.currentId + 1}. ${this.textValue}`,
                    done: false
                }
            ];

            this.currentId++;
            this.textValue = '';
        }
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