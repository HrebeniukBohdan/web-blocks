import { WebBlock, SignalType, State, Prop, Signal } from '../web-blocks/core';
import { HTTPService } from "./services";

/*
@WebBlock({
    selector: 'nested-comp',
    template: (s: NestedComponet) => h(
        'ul', 
        { style: { padding: '8px', background: 'green'} }, 
        s.list.map((li, key) => h('li', { key }, `${li}`))
    )
})
export class NestedComponet {
    @Prop list: number[];

    wbInit(): void {
        console.log('nested-comp init');
    }

    wbViewInit(): void {
        console.log('nested-comp view init');
    }

    wbDestroy(): void {
        console.log('nested-comp view destroy');
    }
}

@WebBlock({
    selector: 'my-comp',
    template: (s: MyComp) => h('div', { 
        style: { padding: '8px', background: 'red'},
        on: {
            click: s.clickHandler.bind(s)
        }
    }, [
        'It is my component ',
        h('span', {}, `"${s.name}" - "${s.state1}"`),
        wb(NestedComponet, { list: s.list })
    ]),
})
export class MyComp {
    @Prop list: number;
    @Prop yo: boolean;
    @Prop name: string;
    @State state1: string;
    @State state2: string;

    constructor(private dataServ: DataService) {}

    wbInit(): void {
        console.log('my-comp init');
    }

    wbViewInit(): void {
        console.log('my-comp view init');
    }

    wbDestroy(): void {
        console.log('my-comp view destroy');
    }

    clickHandler(): void {
        this.dataServ.getData();
        console.log('click on');
        this.state1 = this.state1 + 'a';
    }
}

@WebBlock({
    selector: 'root-component',
    template: (s: RootComponent) => h('div', { 
        style: { padding: '20px', background: 'yellow'},
    }, [
        h('button', { 
            style: { margin: '10px', padding: '10px', cursor: 'pointer' },
            on: {
                click: s.showHideHandler.bind(s)
            }
        }, `${s.show ? 'Hide':'Show'} me!`),
        h('button', { 
            style: { margin: '10px', padding: '10px', cursor: 'pointer' },
            on: {
                click: s.clickHandler.bind(s)
            }
        }, 'Add new item!'),
        wbIf(s.show, wb(MyComp, { name: s.name, list: s.list }))
    ]),
})
export class RootComponent {
    @State name = 'My super component';
    @State list = [1, 2, 3, 4, 5];
    @State show = true;

    constructor(private http: HTTPService) {
        // yo
    }

    wbInit(): void {
        console.log('root-comp init');
    }

    wbViewInit(): void {
        console.log('root-comp view init');
    }

    clickHandler(): void {
        console.log('click on root');
        this.http.post();
        this.list = [...this.list, this.list.length + 1];
    }

    showHideHandler(): void {
        this.http.put();
        this.show = !this.show;
    }
}*/

/*@WebBlock({
    selector: 'root-component',
    template: (s: RootComponent) => h(
        'div', 
        { }, 
        [
            h('button', { on: {
                click: s.onButtonClick.bind(s) 
              } 
            }, s.showHide ? 'Hide' : 'Show'),
            h('button', { on: {
                click: s.onAddClick.bind(s) 
              } 
            }, 'Add element'),
            h('button', { on: {
                click: s.onRemoveClick.bind(s) 
              } 
            }, 'Remove element'),
            wb(ModComponent, { show: s.showHide, list: s.list })
        ]
    )
})*/
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
        console.log('yo');
        console.log(msg);
    }
}

@WebBlock({
    selector: 'mod-component',
    template: `
        <div style="font-size: 16px;">
            Yo nigga
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
})
export class ModComponent {
    @State name = 'My super component';

    @Prop list: number[];
    @Prop show: boolean;

    @Signal message: SignalType<number>;

    constructor(private http: HTTPService) {
        // yo
    }

    wbInit(): void {
        console.log('mod-comp init');
    }

    wbViewInit(): void {
        console.log('mod-comp view init');
    }

    transformIndex(index: number): number {
        return index + 1;
    }

    onButtonClick(): void {
        // call message
        this.message(this.list.length);
    }
}