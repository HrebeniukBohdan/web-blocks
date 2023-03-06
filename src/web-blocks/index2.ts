import { createComponent, createElement, createText, VDomNode } from "./vdom/virtual_dom";
import { renderDOM } from "./vdom/render";
import { Component } from "./vdom/component";
import './index2.scss';

interface NewItemFormState {
    name: string
}

interface NewItemFormProps {
    addItem: (name: string) => void
}

class NewItemForm extends Component<NewItemFormProps, NewItemFormState> {

    state = { name: '' }

    render() {
        return createElement(
            'form',
            { id: 'new-item-form',
              onsubmit: (e: Event) => {
                e.preventDefault()
                this.props.addItem(this.state.name)
                this.setState(() => ({ name: '' }))
              }
            },
            [
                createElement('label', { 'for': 'i-n' }, [ createText('New item') ]),
                createElement('input',
                    { id: 'i-n', 
                      value: this.state.name,
                      oninput: (e: any) => this.setState(s => ({...s, name: e.target.value})) }
                )
            ],
        )
    }
}

interface ToDoItem {
    name: string
    done: boolean
}

interface ToDoState {
    items: ToDoItem[]
}

class ToDoComponent extends Component<{}, ToDoState> {

    state: ToDoState = { items: [] }

    toggleItem(index: number) {
        this.setState(s => ({items: s.items.map((item, i) => {
            if(index == i) return { ...item, done: !item.done }
            return item
        })}))
    }

    removeItem(index: number) {
      this.setState(s => ({...s, items: s.items.filter((_, i) => i !== index)}));
    }

    render() {
        return createElement('div', {},
            [
                createComponent(NewItemForm, {
                    addItem: n => this.setState(s => ({ items: s.items.concat([{name: n, done: false}])}))
                }),
                createElement('ul', { }, 
                    this.state.items.map((item: ToDoItem, i) => 
                        createElement( 'li', { key: i.toString() },
                            [
                                createElement('button', { 
                                        onclick: () => this.toggleItem(i)
                                    }, 
                                    [createText(item.done ? 'done' : '-')]
                                ),
                                createText(item.name),
                                createElement('button', { 
                                        onclick: () => this.removeItem(i)
                                    }, 
                                    [createText('X')]
                                )
                            ]
                        )
                    )
                )
            ]
        )
    }
}

renderDOM('root', createComponent(ToDoComponent, {key: 'L'}))