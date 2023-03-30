import { WbInit } from './../../../web-blocks/core/types';
import { Prop, Signal, SignalType, WebBlock } from '../../../web-blocks/core';
import { IOption } from '../types';

@WebBlock({
    selector: 'todo-filter',
    template: `
        <div class="btn-group" role="group">
          <%wb-for iterable={{$options}} %>
            <button type="button" class={{$activeClass($current.value)}} @click={{$onButtonClick($current.value)}}>
              {{$current.name}}
            </button>
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

    onButtonClick(newValue: string): void {
      if (newValue !== this.currentValue) {
        this.valueChange(newValue);
      }
    }

    activeClass(value: string): string {
      return `btn btn-light ${this.currentValue === value ? 'active' : ''}`;
    }
}