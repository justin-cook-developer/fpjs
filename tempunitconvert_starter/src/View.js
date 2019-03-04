import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { takeLeftInput, takeRightInput, unitChangeLeft, unitChangeRight, } from './Update';

const {
  div,
  h1,
  pre,
  option,
  select,
  input
} = hh(h);

const UNITS = ['Kelvin', 'Celsius', 'Fahrenheit'];

function unitOptions(selectedUnit) {
  return R.map(
    (unit) => option({ value: unit, selected: unit === selectedUnit, }, unit),
    UNITS,
  );
}

function unitSection(dispatch, degrees, selectedUnits, handleInputs, handleUnits) {
  return div({ className: 'w-50 ma1'}, [
    input({
      type: 'text',
      value: degrees,
      oninput: e => dispatch(handleInputs(e.target.value)),
    }),
    select({
      onchange: e => dispatch(handleUnits(e.target.value)),
    },
    [
      unitOptions(selectedUnits),
    ]),
  ]);
}

function body(dispatch, model) {
  return div({ className: 'flex' }, [
    unitSection(dispatch, model.leftFieldValue, model.leftUnits, takeLeftInput, unitChangeLeft),
    div('='),
    unitSection(dispatch, model.rightFieldValue, model.rightUnits, takeRightInput, unitChangeRight),
  ]);
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Temperature Unit Converter'),
    // pre(JSON.stringify(model, null, 2)),
    body(dispatch, model),
  ]);
}

export default view;
