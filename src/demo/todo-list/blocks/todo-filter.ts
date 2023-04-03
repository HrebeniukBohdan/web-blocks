import { WbInit } from './../../../web-blocks/core/types';
import { Prop, Signal, SignalType, WebBlock } from '../../../web-blocks/core';
import { IOption } from '../types';

@WebBlock({
    selector: 'todo-filter',
    template: `
        <div class="btn-group" role="group">
          <%wb-for iterable={{$options}} %>
            <wb-todo-option-button 
                option={{$current}}
                selected={{$isSelected($current.value)}}
                @optionValueSelected={{$onButtonClick($$event)}}
              />
          <%/wb-for%>
        </div>
    `
})
export class TodoFilterSwitch implements WbInit {
    @Prop currentValue: string;
    @Prop options: IOption[];
    
    @Signal valueChange: SignalType<string>;

    wbInit() {
      console.log('Filter Switch Init');
    }

    isSelected(value: string): boolean {
      return this.currentValue === value;
    }

    onButtonClick(newValue: string): void {
      if (newValue !== this.currentValue) {
        this.valueChange(newValue);
      }
    }
}