import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { newLocationMessage, getLocationInput } from './Update';

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
      oninput: e => dispatch(getLocationInput(makeProperCasing(e.target.value))),
    })
  ])
}

const formComponent = (dispatch, model) => {
  return form({
    id: 'form',
    onsubmit: _ => dispatch(newLocationMessage),
  }, [
    formGroupComponent(dispatch, model.nextLocation),
    button({ id: 'submit', type: 'submit' }, 'Add City'),
  ]);
}

// CITIES VIEW

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Weather'),
    pre(JSON.stringify(model, null, 2)),
    formComponent(dispatch, model),
  ]);
}

export default view;
