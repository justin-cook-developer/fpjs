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
  return div({ className: 'flex' }, [
    p(title),
    p(value),
  ]);
}

function inputGroup(dispatch, model) {
  return div([
    inputItem(dispatch, 'Bill Amount', model.bill, billChangeCreator),
    inputItem(dispatch, 'Tip %', model.tipPercentage, percentChangeCreator),
  ]);
}

function displayGroup(tip, total) {
  return div([
    displayItem('Tip:', tip),
    displayItem('Total Amount:', total),
  ]);
}

function view(dispatch, model) {
  const { bill, tipPercentage } = model;
  const [billFloat, tipPercFloat] = getFloats([bill, tipPercentage]);
  const tipFloat = calculateTip(tipPercFloat, billFloat);
  const [tip, total] = toMoneyFormat([tipFloat, tipFloat + billFloat]);

  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Tip Calculator'),
    // pre(JSON.stringify(model, null, 2)),
    inputGroup(dispatch, model),
    displayGroup(tip, total),
  ]);
}


function toFloat(val) {
  return R.pipe(
    parseFloat,
    R.defaultTo(0),
  )(val);
}

function getFloats(vals) {
  return R.map(toFloat, vals);
}

function calculateTip(perc, bill) {
  return bill * (perc / 100.00);
}

function moneyFormat(val) {
  const string = val.toFixed(2);
  return `$${string}`;
}

function toMoneyFormat(vals) {
  return R.map(moneyFormat, vals);
}

export default view;
