import { diff, patch } from 'virtual-dom';
import createElement from 'virtual-dom/create-element';
import * as R from 'ramda'
import axios from 'axios';

function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    const updates = update(msg, model);
    const isArray = R.type(updates) === 'Array';
    model = isArray ? updates[0] : updates;
    const directive = isArray ? updates[1] : null;
    serverEffects(dispatch, directive);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

function serverEffects(dispatch, directive) {
  if (directive === null) {
    return;
  }
  const { request, successMessage } = directive;
  axios(request).then(res => dispatch(successMessage(res))).catch(console.error);
}

export default app;
