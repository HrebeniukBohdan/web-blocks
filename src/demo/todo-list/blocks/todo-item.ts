import { Prop, Signal, SignalType, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-item',
    template: `
        <li class={{$activeClass()}}>
            <span>{{$data}}</span>
            <span class="close" @click={{$onCloseClick()}}>×</span>
        </li>
    `
})
export class TodoItem {
    @Prop data: TodoTaskData;
    @Signal close: SignalType<number>;

    onCloseClick(): void {
        this.close(this.data.id);
    }

    activeClass(): string {
        return this.data.done ? 'checked' : '';
    }
}