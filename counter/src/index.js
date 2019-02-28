import hh from 'hyperscript-helpers'
import { h, diff, patch } from 'virtual-dom'
import createElement from 'virtual-dom/create-element'

const { div, button } = hh(h);

const initModel = 0;

function view(model, dispatch) {
  return div([
    div({ className: 'mv2' }, `Count: ${model}`),
    button({ className: 'pv1 ph2 mr2',
      onclick: () => dispatch(MESSAGES.ADD)
    }, '+'),
    button({ className: 'pv1 ph2',
      onclick: () => dispatch(MESSAGES.SUB)
    }, '-'),
  ]);
}

const MESSAGES = {
  ADD: 'ADD',
  SUB: 'SUBTRACT'
};

function update(msg, model) {
  switch(msg) {
    case 'ADD':
      return model + 1;
    case 'SUBTRACT':
      return model - 1;
    default:
      return model;
  }
}

// impure code
function app(initModel = 0, update, view, node) {
  let model = initModel;
  let currentView = view(model, dispatch);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);

  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(model, dispatch);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

const rootNode = document.getElementById('app');

app(initModel, update, view, rootNode);

