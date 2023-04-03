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

            <%wb-unless condition={{$notLoading}} %>
                <div class="d-flex justify-content-center align-items-center todo-loading">
                    <div role="status" class="spinner-border text-danger">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            <%/wb-unless%>
        </div>
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

    currentId = 5;

    constructor(private api: TodoApiService) {}

    wbInit(): void {
        console.log(this);
        this.notLoading = false;
        this.api.getTodoTaskList().then(
            tasks => this.tasks = tasks
        )
        .finally(
            () => this.notLoading = true
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
            this.notLoading = false;
            this.api.addNewTodoTask(this.textValue).then(
                tasks => this.tasks = tasks
            ).finally(
                () => {
                    this.notLoading = true;
                    this.textValue = '';
                }
            )
        }
    }

    removeTask(id: number): void {
        this.notLoading = false;
        this.api.removeTodoTask(id).then(
            tasks => this.tasks = tasks
        ).finally(
            () => this.notLoading = true
        )
    }

    changeItemStatus(id: number): void {
        console.log('Clicked on = ' + (id + 1));
        this.notLoading = false;
        this.api.changeTodoTaskStatus(id).then(
            tasks => this.tasks = tasks
        ).finally(
            () => this.notLoading = true
        )
    }
}