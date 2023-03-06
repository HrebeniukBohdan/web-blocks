import { Prop, Signal, SignalType, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-item',
    template: `
        <li class={{$getClass()}} @click={{$onStatusChange()}}>
            {{$itemTitle()}}
        </li>
    `
})
export class TodoItem {
    @Prop data: TodoTaskData;
    @Signal statusChange: SignalType<TodoTaskData>;

    wbInit(): void {
        console.log('wb init item id = ' + this.data.id);
        console.log(this.data);
    }

    wbChange(): void {
        console.log('wb change item id = ' + this.data.id);
        console.log(this.data);
    }

    wbDestroy(): void {
        console.log('wb destroy item id = ' + this.data.id);
        console.log(this.data);
    }

    onStatusChange(): void {
        this.statusChange(this.data);
    }

    getClass(): string | undefined {
        return this.data.done ? 'selected-item' : undefined;
    }

    itemTitle(): string {
        return this.data.text;
    }
}