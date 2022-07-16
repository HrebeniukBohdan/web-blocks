import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
    VNode,
    fragment,
  } from 'snabbdom/build';
  
  const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
  ], undefined, {
    experimental: {
      fragments: true,
    }
  });
  
  const container: any = document.getElementById("root");
  // patch(container, wb(MyComp, { name: 'My super component', list: [1, 2, 3, 4, 5]}));


  const clickHandler1 = () => console.log('click!');
  const vnode = h(
    "div#container.two.classes", { on: { click: clickHandler1 } }, [
    h("span", { style: { fontWeight: "bold" } }, "This is bold"),
    " and this is just normal text",
    h("a", { props: { href: "/foo" },
      hook: {
        create: (emptyVNode: VNode, vNode: VNode) => {
          console.log('a created');
        },
        insert: (vNode: VNode) => {
          console.log('a inserted');
        },
        destroy: (vnode: VNode) => {
          console.log('a destroyed');
        },
      },
    }, "I'll take you places!"),
    h("div", { key: 1, style: { backgroundColor: 'red', width: '100px', height: '100px' },
      hook: {
        create: (emptyVNode: VNode, vNode: VNode) => {
          console.log(' div created');
        },
        insert: (vNode: VNode) => {
          console.log(' div inserted');
        },
        postpatch: (old, newn) => {
          console.log(newn);
          console.log(' div postpatched');
        },
        destroy: (vnode: VNode) => {
          console.log(' div destroyed');
        },
      },
    }, [
      h("div", {
        hook: {
          create: (emptyVNode: VNode, vNode: VNode) => {
            console.log('  div1 created');
          },
          insert: (vnode: VNode) => {
            console.log('  div1 inserted');
          },
          postpatch: (old, newn) => {
            console.log(newn);
            console.log('  div1 postpatched');
          },
          destroy: (vnode: VNode) => {
            console.log('  div1 destroyed');
          },
          remove: (vnode: VNode) => {
            console.log('  div1 removed');
          },
        }
      }, [
        h("div", {
          hook: {
            create: (emptyVNode: VNode, vNode: VNode) => {
              console.log('   div1-1 created');
            },
            insert: (vnode: VNode) => {
              console.log('   div1-1 inserted');
            },
            postpatch: (old, newn) => {
              console.log(newn);
              console.log('   div1-1 postpatched');
            },
            destroy: (vnode: VNode) => {
              console.log('   div1-1 destroyed');
            },
          }
        }, 'div1-1'),
        h("div", {
          hook: {
            create: (emptyVNode: VNode, vNode: VNode) => {
              console.log('   div1-2 created');
            },
            insert: (vnode: VNode) => {
              console.log('   div1-2 inserted');
            },
            postpatch: (old, newn) => {
              console.log(newn);
              console.log('   div1-2 postpatched');
            },
            destroy: (vnode: VNode) => {
              console.log('   div1-2 destroyed');
            },
          }
        }, 'div1-2')
      ]),
      h("span", {
        hook: {
          create: (emptyVNode: VNode, vNode: VNode) => {
            console.log('  span2 created');
          },
          insert: (vnode: VNode) => {
            console.log('  span2 inserted');
          },
          postpatch: (old, newn) => {
            console.log(newn);
            console.log('  span2 postpatched');
          },
          destroy: (vnode: VNode) => {
            console.log('  span2 destroyed');
          },
          remove: (vnode: VNode) => {
            console.log('  span2 removed');
          },
        }
      }, "span2")
    ]),
  ]);
  // Patch into empty DOM element – this modifies the DOM as a side effect
  patch(container, vnode);
  console.log('patch 1');
  
  const newVnode = h(
    "div#container.two.classes",
    { on: { click: clickHandler1 } },
    [
      h(
        "span",
        { style: { fontWeight: "normal", fontStyle: "italic" } },
        "This is now italic type"
      ),
      " and this is still just normal text",
      h("a", { props: { href: "/bar" },
        hook: {
          insert: (vnode: VNode) => {
            console.log('a inserted');
          },
          destroy: (vnode: VNode) => {
            console.log('a destroyed');
          },
        },
      }, "I'll take you places!"),
      h("div", { key: 1, style: { backgroundColor: 'red', width: '100px', height: '100px' },
      hook: {
        create: (emptyVNode: VNode, vNode: VNode) => {
          console.log(' div created');
        },
        insert: (vNode: VNode) => {
          console.log(' div inserted');
        },
        postpatch: (old, newn) => {
          console.log(newn);
          console.log(' div postpatched');
        },
        destroy: (vnode: VNode) => {
          console.log(' div destroyed');
        },
      },
    }, [
      h("div", {
        hook: {
          create: (emptyVNode: VNode, vNode: VNode) => {
            console.log('  div1 created');
          },
          insert: (vnode: VNode) => {
            console.log('  div1 inserted');
          },
          postpatch: (old, newn) => {
            console.log(newn);
            console.log('  div1 postpatched');
          },
          destroy: (vnode: VNode) => {
            console.log('  div1 destroyed');
          },
          remove: (vnode: VNode) => {
            console.log('  div1 removed');
          },
        }
      }, [
        h("div", {
          hook: {
            create: (emptyVNode: VNode, vNode: VNode) => {
              console.log('   div1-1 created');
            },
            insert: (vnode: VNode) => {
              console.log('   div1-1 inserted');
            },
            postpatch: (old, newn) => {
              console.log(newn);
              console.log('   div1-1 postpatched');
            },
            destroy: (vnode: VNode) => {
              console.log('   div1-1 destroyed');
            },
          }
        }, 'div1-1'),
        h("div", {
          hook: {
            create: (emptyVNode: VNode, vNode: VNode) => {
              console.log('   div1-2 created');
            },
            insert: (vnode: VNode) => {
              console.log('   div1-2 inserted');
            },
            postpatch: (old, newn) => {
              console.log(newn);
              console.log('   div1-2 postpatched');
            },
            destroy: (vnode: VNode) => {
              console.log('   div1-2 destroyed');
            },
          }
        }, 'div1-2')
      ]),
      h("span", {
        hook: {
          create: (emptyVNode: VNode, vNode: VNode) => {
            console.log('  span2 created');
          },
          insert: (vnode: VNode) => {
            console.log('  span2 inserted');
          },
          postpatch: (old, newn) => {
            console.log(newn);
            console.log('  span2 postpatched');
          },
          destroy: (vnode: VNode) => {
            console.log('  span2 destroyed');
          },
          remove: (vnode: VNode) => {
            console.log('  span2 removed');
          },
        }
      }, "span2")
    ]),
    h("!", {
      hook: {
          post: () => {
            console.log('! post');
          },
        }
      }, 'ffdfsdfsd', ),
    ]
  );
  // Second `patch` invocation
  patch(vnode, newVnode);
  console.log('patch 2');
  console.log(fragment(['Zalupa',h('div', {}, ['Zalupa DIV'])]));

  const newVnode1 = h(
    "div#container.two.classes",
    { on: { click: clickHandler1 } },
    [
      fragment(['Zalupa', h('div', { class: { myClass: true } }, ['Zalupa DIV'])]),
      h(
        "span",
        { style: { fontWeight: "normal", fontStyle: "italic" } },
        "This is now italic type"
      ),
      " and this is still just normal text",
      /*h("div", { key: 1, style: { backgroundColor: 'red', width: '100px', height: '100px' },
      hook: {
        insert: (vnode: VNode) => {
          console.log('div inserted');
        },
        destroy: (vnode: VNode) => {
          console.log('div destroyed');
        },
      },
    }, [
      
    ]),
    */

      /*h("!", {
        hook: {
            post: () => {
              console.log('! post');
            },
          }
        }, 'ffdfsdfsd', ),*/
    ]
  );
  // Third `patch` invocation
  patch(newVnode, newVnode1);
  console.log('patch 3');