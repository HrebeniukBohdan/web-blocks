import { renderDOM } from "./vdom_h/render";
import { Component } from "./vdom_h/component";
import './index2.scss';
import { h } from "./vdom_h/h";
import { createComponent } from "./vdom_h/virtual_dom";

interface NewItemFormState {
    name: string
}

interface NewItemFormProps {
    addItem: (name: string) => void
}

class NewItemForm extends Component<NewItemFormProps, NewItemFormState> {

    state = { name: '' }

    render() {
        console.log(`Input Form ${this.state.name} Rendered`);
        return h(
            'form',
            { id: 'new-item-form',
              onsubmit: (e: Event) => {
                e.preventDefault()
                this.props.addItem(this.state.name)
                this.setState(() => ({ name: '' }))
              }
            },
            [
                h('label', { for: 'i-n' }, 'New item'),
                h('input',
                    { id: 'i-n', 
                      value: this.state.name,
                      oninput: (e: any) => this.setState(s => ({...s, name: e.target.value})) 
                    }
                )
            ]
        )
    }

    componentDidMount() {
        console.log(`Input Form ${this.state.name} Mounted`);
    }

    componentDidUpdate() {
        console.log(`Input Form ${this.state.name} Updated`);
    }

    componentWillUnmount() {
        console.log(`Input Form ${this.state.name} Unmounted`);
    }
}

interface ToDoItem {
    name: string
    done: boolean
    id: number
}

interface ToDoState {
    items: ToDoItem[]
}

interface ToDoItemProps {
    item: ToDoItem
    onDoneClick: () => void
    onRemoveClick: () => void
}

class ToDoItemComponent extends Component<ToDoItemProps, boolean> {

    state = false;

    render() {
        console.log(`Todo Item "${this.props.item.name}" Rendered`);
        return h( 'li',
            { style: this.props.item.done ? 'background: red; color: #fff;' : undefined },
            [
                h('button', { onclick: this.props.onDoneClick }, this.props.item.done ? 'done' : '-'),
                this.props.item.id + '. ' + this.props.item.name,
                h('button', { onclick: this.props.onRemoveClick }, 'X'),
                h('span', { style: 'margin: 0 5px;' }, this.state ? '+' : '-'),
                h('button', { onclick: () => this.setState(flag => !flag) }, 'btn'),
            ]
        )
    }

    componentDidMount() {
        console.log(`Todo Item "${this.props.item.name}" Mounted`);
    }

    componentDidUpdate() {
        console.log(`Todo Item "${this.props.item.name}" Updated`);
    }

    componentWillUnmount() {
        console.log(`Todo Item "${this.props.item.name}" Unmounted`);
    }
}

class ToDoComponent extends Component<{}, ToDoState> {

    id: number = 4;
    state: ToDoState = { 
        items: [
            { name: 'Item #1', done: false, id: 1 },
            { name: 'Item #2', done: false, id: 2 },
            { name: 'Item #3', done: false, id: 3 },
        ] 
    }

    toggleItem(index: number) {
        this.setState(s => ({items: s.items.map((item, i) => {
            if(index == i) return { ...item, done: !item.done }
            return item
        })}))
    }

    removeItem(index: number) {
      this.setState(s => ({...s, items: s.items.filter((_, i) => i !== index)}));
    }

    get sortedItems(): ToDoItem[] {
        const array = [...this.state.items].sort((aTask, bTask) => {
            if (!aTask.done && bTask.done) return -1;
            if (aTask.done && !bTask.done) return 1;
            return 0;
        });
        return array;
    }

    render() {
        console.log(`Todo Form Rendered`);
        return h('div', {},
            [createComponent(NewItemForm, {
                addItem: n => this.setState(s => ({ items: s.items.concat([{name: n, done: false, id: this.id++}])}))
            }),
            h('ul', { }, 
                this.sortedItems.map((item: ToDoItem, i) => 
                    createComponent(ToDoItemComponent, { 
                        key: item.id.toString(),
                        item,
                        onDoneClick: () => this.toggleItem(i),
                        onRemoveClick: () => this.removeItem(i)
                    })
                )
            )]
        )
    }

    componentDidMount() {
        console.log(`Todo Form Mounted`);
    }

    componentDidUpdate() {
        console.log(`Todo Form Updated`);
    }

    componentWillUnmount() {
        console.log(`Todo Form Unmounted`);
    }
}

/**  */
renderDOM('root', createComponent(ToDoComponent, {key: 'L'}))