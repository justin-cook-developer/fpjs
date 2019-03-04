import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

const {
  div,
  h1,
  pre,
  option,
  select,
  input
} = hh(h);

// my attempt
// function inputField(dispatch, model, side) {
//   const degrees = model[`${side}FieldValue`];
//   return input({
//     value: degrees,
//     oninput: () => console.log(`input on ${side}`)
//   });
// }

// function selectorField(dispatch, model, side) {
//   const units = model[`${side}Units`];
//   return select({
//     value: units,
//     oninput: () => console.log(`input on ${side}`)
//   },
//   [
//     option('Celsius'),
//     option('Fahrenheit'),
//     option('Kelvin'),
//   ]
//   )
// }

// function tempEncapsulation(dispatch, model, side) {
//   return div([
//     inputField(dispatch, model, side),
//     selectorField(dispatch, model, side),
//   ])
// }

const UNITS = ['Kelvin', 'Celsius', 'Fahrenheit'];

function unitOptions(selectedUnits) {
  return R.map(
    (unit) => option({ value: unit, selected: unit === selectedUnits }, unit),
    UNITS,
  );
}

function unitSection(dispatch, degrees, selectedUnits) {
  return div({ className: 'w-50 ma1'}, [
    input({
      type: 'text',
      value: degrees,
    }),
    select([
      unitOptions(selectedUnits),
    ]),
  ]);
}

function body(dispatch, model) {
  return div({ className: 'flex' }, [
    unitSection(dispatch, model.leftFieldValue, model.leftUnits),
    div('='),
    unitSection(dispatch, model.rightFieldValue, model.rightUnits),
  ])
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Temperature Unit Converter'),
    pre(JSON.stringify(model, null, 2)),
    body(dispatch, model),
  ]);
}

export default view;
