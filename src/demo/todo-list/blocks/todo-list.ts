import { State, WbInit, WebBlock } from '../../../web-blocks/core';
import { TodoApiService } from '../services/todo-api';
import { IOption, TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-list',
    template: `
        <div class="header">
            <h2>My To-Do List</h2>
            <input 
                type="text"
                placeholder="Title..."
                value={{$textValue}}
                @keyup={{$onKeyup($$event)}}
                @change={{$onTextChange($$event)}}
            />
            <span @click={{$newElement()}} class="addBtn">Add Item</span>
        </div>
        <div class="filter-bar">
            <span class="filter-text">Sort by:</span>
            <wb-todo-filter 
                currentValue={{$filterValue}}
                options={{$filterOptions}}
                @valueChange={{$onFilterValueChange($$event)}}
            />
        </div>

        <div class="todo-body">
            <!-- Items list -->
            <ul>
                <%wb-for iterable={{$tasks|taskSort:$filterValue}} trackBy='id' %>
                    <wb-todo-item 
                        data={{$current}}
                        @close={{$removeTask($$event)}}
                        @statusChange={{$changeItemStatus($$event)}}
                    />
                <%/wb-for%>
            </ul>
        </div>
        
        <%wb-unless condition={{$notLoading}} %>
            <div class="d-flex justify-content-center align-items-center todo-loading">
                <div role="status" class="spinner-border text-danger">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        <%/wb-unless%>
    `
})
export class TodoList implements WbInit {
    @State tasks: TodoTaskData[] = [];
    @State textValue = '';
    @State filterValue = 'asc';
    @State notLoading = true; 

    filterOptions: IOption[] = [
        { name: 'ASC', value: 'asc' },
        { name: 'DESC', value: 'desc' },
    ];

    constructor(private api: TodoApiService) {}

    wbInit(): void {
        console.log(this);
        this.invoke(
            this.api.getTodoTaskList().then(
                tasks => this.tasks = tasks
            )
        )
    }

    wbChange(): void {
        console.log('wb change list');
        console.log(this.tasks);
    }

    wbDestroy(): void {
        console.log('wb destroy list');
    }

    onFilterValueChange(newFilterValue: string): void {
        this.filterValue = newFilterValue;
    }

    onTextChange(event: Event): void {
        console.log(event);
        this.textValue = (event.target as HTMLInputElement).value;
    }

    onKeyup(event: KeyboardEvent): void {
        if (event.code === 'Enter') {
            event.preventDefault();
            this.newElement();
        }
    }

    newElement(): void {
        if (this.textValue) {
            this.invoke(
                this.api.addNewTodoTask(this.textValue).then(
                    tasks => {
                        this.tasks = tasks;
                        this.textValue = '';
                    }
                )
            )
        }
    }

    removeTask(id: number): void {
        this.invoke(
            this.api.removeTodoTask(id).then(
                tasks => this.tasks = tasks
            )
        );
    }

    changeItemStatus(id: number): void {
        console.log('Clicked on = ' + (id + 1));

        this.invoke(
            this.api.changeTodoTaskStatus(id).then(
                tasks => this.tasks = tasks
            )
        );
    }

    private invoke(promise: Promise<unknown>): void {
        this.notLoading = false;
        promise.finally(
            () => this.notLoading = true
        );
    }
}