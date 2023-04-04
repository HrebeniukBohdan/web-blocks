import { VDomNode } from './../../../web-blocks/vdom/virtual_dom';
import { H, HookUseCallback } from '../../../web-blocks/core/compile';
import { Prop, Signal, SignalType, WebBlock } from '../../../web-blocks/core';
import { TodoTaskData } from '../types';

/**
 *  Template
 *  @example:`
        <li class={{$getClass()}} @click={{$onStatusChange()}}>
            {{$itemTitle()}}
        </li>
    `
 */

/** 
 *  Manual render function
 *  @example:
        (ctx: TodoItem, h: H, useCallback: L): VDomNode => {
            const onStatusChangeClbk = useCallback(
                () => ctx.onStatusChange()
            );

            return h(
                'li', { class: ctx.getClass() }, { click: onStatusChangeClbk }, 
                [`${ctx.itemTitle()}`]
            );
        } 
 */
@WebBlock({
    selector: 'todo-item',
    template: (ctx: TodoItem, h: H, useCallback: HookUseCallback): VDomNode => {
        const onStatusChangeClbk = useCallback(
            () => ctx.onStatusChange()
        );

        return h(
            'li', { class: ctx.getClass() }, { click: onStatusChangeClbk }, 
            [`${ctx.itemTitle()}`]
        );
    }
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