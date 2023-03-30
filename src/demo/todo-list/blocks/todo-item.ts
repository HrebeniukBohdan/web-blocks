import { Prop, Signal, SignalType, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

@WebBlock({
    selector: 'todo-item',
    template: `
        <li class={{$activeClass()}}>
            <span class="title"
                  title="Change item status"
                  @click={{$onStatusChange()}}
                >
                {{$itemTitle()}}
            </span>
            <span class="close"
                  title="Remove item"
                  @click={{$onCloseClick()}}
                >
                ×
            </span>
        </li>
    `
})
export class TodoItem {
    @Prop data: TodoTaskData;
    @Signal close: SignalType<number>;
    @Signal statusChange: SignalType<number>;

    wbInit(): void {
        console.log('wb init item');
        console.log(this.data);
    }

    wbViewInit(elem: HTMLElement): void {
        console.log('wb view init item');
        console.log(elem);
    }

    wbChange(): void {
        console.log('wb change item');
        console.log(this.data);
    }

    wbDestroy(): void {
        console.log('wb destroy item');
        console.log(this.data);
    }

    onCloseClick(): void {
        this.close(this.data.id);
    }

    onStatusChange(): void {
        this.statusChange(this.data.id);
    }

    activeClass(): string {
        return this.data.done ? 'checked' : '';
    }

    itemTitle(): string {
        return this.data.text;
    }
}