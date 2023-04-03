import { Prop, Signal, SignalType, WebBlock } from '../../../web-blocks/core';
import { IOption } from '../types';

@WebBlock({
    selector: 'todo-option-button',
    template: `
        <button type="button" class={{$activeClass()}} @click={{$optionValueSelected($option.value)}}>
              {{$option.name}}
        </button>
    `
})
export class TodoOptionButton {
    @Prop option: IOption;
    @Prop selected: boolean;

    @Signal optionValueSelected: SignalType<string>;

    activeClass(): string {
      return `btn btn-light ${this.selected ? 'active' : ''}`;
    }
}