import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { billChangeCreator, percentChangeCreator } from './Update';

const {
  div,
  h1,
  pre,
  input,
  p
} = hh(h)


function inputItem(dispatch, title, value, handleInput) {
  return div([
    p(title),
    input({
      type: 'text',
      value: value,
      oninput: e => {;
        dispatch(handleInput(e.target.value));
      },
    }),
  ]);
}

function displayItem(title, value) {
  const stringValue = value.toString();
  return div({ className: 'flex' }, [
    p(title),
    p(stringValue),
  ]);
}

function inputGroup(dispatch, model) {
  return div([
    inputItem(dispatch, 'Bill Amount', model.bill, billChangeCreator),
    inputItem(dispatch, 'Tip %', model.tipPercentage, percentChangeCreator),
  ]);
}

function displayGroup(model) {
  return div([
    displayItem('Tip:', model.tipAmount),
    displayItem('Total Amount:', model.total),
  ]);
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Tip Calculator'),
    // pre(JSON.stringify(model, null, 2)),
    inputGroup(dispatch, model),
    displayGroup(model),
  ]);
}

export default view;
