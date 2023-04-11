import { H } from '../../web-blocks/core/compile';
import { WebBlock, SignalType, State, Prop, Signal } from '../../web-blocks/core';
import { HTTPService } from "./services";

/*
@WebBlock({
    selector: 'root-component',
    template: `
        <div @mouseleave={{$onMouseMove($$event)}}>
            <button @click={{$onButtonClick()}}>{{$showBtnLabel()}}</button>
            <button @click={{$onAddClick()}}>Add element</button>
            <button @click={{$onRemoveClick()}}>Remove element</button>
            <wb-mod-component show={{$showHide}} list={{$list}} @message={{$onMessage($$event)}} />
        </div>
    `
})*/
@WebBlock({
    selector: 'root-component',
    template: (s: RootComponent, h: H) => h(
        'div', null, null, 
        [
            h('button', null, { click: s.onButtonClick.bind(s) }, s.showHide ? 'Hide' : 'Show'),
            h('button', null, { click: s.onAddClick.bind(s) }, 'Add element'),
            h('button', null, { click: s.onRemoveClick.bind(s) }, 'Remove element'),
            h('wb-mod-component', { show: s.showHide, list: s.list })
        ]
    )
})
export class RootComponent {
    @State showHide = false;
    @State list = [1, 2, 3, 4, 5];

    onMouseMove(event: Event): void {
        console.log(event);
    }

    onButtonClick(): void {
        this.showHide = !this.showHide;
    }

    onAddClick(): void {
        console.log('Add button click');
        this.list = [...this.list, 1];
    }

    onRemoveClick(): void {
        console.log('Remove button click');
        this.list = this.list.slice(0, this.list.length - 1);
    }

    showBtnLabel(): string {
        return this.showHide ? 'Hide' : 'Show';
    }

    wbInit(): void {
        console.log('root-component init');
    }

    wbViewInit(): void {
        console.log('root-component view init');
    }

    wbDestroy(): void {
        console.log('root-component view destroy');
    }

    onMessage(msg?: string): void {
        console.log(msg);
    }
}

/*
@WebBlock({
    selector: 'mod-component',
    template: `
        <div style="font-size: 16px;">
            First block
            <div class='redClass'>
                Second block
                <%wb-if condition={{$show}}%>
                    <div>
                        <div class="greenClass">Green block</div>
                        <div>One more block</div>
                        <ol>
                            <%wb-for iterable={{$list}}%>
                                <li>item of the list №{{$transformIndex($index)}}</li>
                            <%/wb-for%>
                        </ol>
                    </div>
                <%/wb-if%>
                <%wb-nothing some={{$show}}%>
                    Third
                <%/wb-nothing%>
            </div>
        </div>
        <button @click={{$onButtonClick()}}>Send message from Mod-component</button>
    `
})*/
@WebBlock({
    selector: 'mod-component',
    template: (s: ModComponent, h: H) => ([
        h('div', { style: 'font-size: 16px;' }, null, [
            'First block',
            h('div', { class: 'redClass' }, null, [
                'Second block',
                s.show && h('div', null, null, [
                    h('div', { class: 'greenClass' }, null, 'Green block'),
                    h('div', null, null, 'One more block'),
                    h('ol', null, null, s.list.map(
                            (liData, index) => h('ol', { key: `${index}`}, null, `item of the list ${s.transformIndex(index)}`)
                        )
                    ),
                ]),
                (s.show || !s.show) && h('div', null, null, 'Third')
            ])
        ]),
        h('button', null, { click: s.onButtonClick.bind(s) }, 'Send message from Mod-component')
    ])
})
export class ModComponent {
    @State name = 'My super component';

    @Prop list: number[];
    @Prop show: boolean;

    @Signal message: SignalType<number>;

    constructor(private http: HTTPService) { }

    wbInit(): void {
        console.log(this.http);
        console.log('mod-comp init');
    }

    wbViewInit(): void {
        console.log('mod-comp view init');
    }

    transformIndex(index: number): number {
        return index + 1;
    }

    onButtonClick(): void {
        this.message(this.list.length);
    }
}
