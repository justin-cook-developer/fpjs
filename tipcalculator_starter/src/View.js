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


// View Functions
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


// Calculation Functions
function calculateTipAndTotal(billAmount, tipPercentage) {
  const bill = parseFloat(billAmount);
  const tip = bill * parseFloat(tipPercentage) / 100 || 0;
  return [tip, bill + tip];
}

const round = places => R.pipe(
    num => num * Math.pow(10, places),
    Math.round,
    num => num * Math.pow(10, -1 * places),
);

const formatMoney = R.curry(
  (symbol, places, number) => {
    return R.pipe(
      R.defaultTo(0),
      round(places),
      num => num.toFixed(places),
      R.concat(symbol),
    )(number);
  }
);

function view(dispatch, model) {
  const { bill, tipPercentage } = model;
  const [tip, total] = calculateTipAndTotal(bill, tipPercentage);
  const toMoney = formatMoney('$', 2);

  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Tip Calculator'),
    // pre(JSON.stringify(model, null, 2)),
    inputGroup(dispatch, model),
    displayGroup(toMoney(tip), toMoney(total)),
  ]);
}


export default view;
