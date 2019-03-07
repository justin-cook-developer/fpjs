import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { newLocationMessage, getLocationInput, deleteLocationMessage } from './Update';

const { div, h1, pre, form, label, input, button, p } = hh(h);

// HELPER FUNCTIONS
const makeProperCasing = word => word[0].toUpperCase() + word.slice(1).toLowerCase();

// FORM VIEW
const formGroupComponent = (dispatch, value) => {
  return div({ id: 'inputGroup' }, [
    label('Location'),
    input({
      type: 'text',
      value,
      oninput: e => R.pipe(makeProperCasing, getLocationInput, dispatch)(e.target.value),
    }),
  ]);
}

const formComponent = (dispatch, nextLocation) => {
  return form({
    id: 'form',
    onsubmit: e => {
      e.preventDefault();
      dispatch(newLocationMessage);
    },
  }, [
    formGroupComponent(dispatch, nextLocation),
    button({ id: 'submit', type: 'submit' }, 'Add City'),
  ]);
}

// CITIES VIEW
const locationComponent = location => {
  return div({ className: 'locationBox' }, [
    p('Location'),
    p(location),
  ]);
}

const dataBoxComponent = (title, data) => {
  const displayData = data !== null ? data : '?';
  return div({ className: 'dataBox' }, [
    p(title),
    p(displayData),
  ]);
}

const dataGroupComponent = city => {
  const { temperature, low, high } = city;
  return div({ className: 'dataGroup' }, [
    dataBoxComponent('Temp', temperature),
    dataBoxComponent('Low', low),
    dataBoxComponent('High', high),
  ]);
}

const cityComponent = (dispatch, city) => {
  return div({ className: 'city' }, [
    button({
      className: 'delete',
      onclick: _ => dispatch(deleteLocationMessage(city.id)),
    }, 'X'),
    div({ className: 'content' }, [
      locationComponent(city.name),
      dataGroupComponent(city),
    ])
  ])
}

const citiesComponent = (dispatch, cities) => {
  return div({ id: 'cities' }, R.map(R.partial(cityComponent, [dispatch]), cities));
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Weather'),
    pre(JSON.stringify(model, null, 2)),
    formComponent(dispatch, model.nextLocation),
    citiesComponent(dispatch, model.cities),
  ]);
}

export default view;
