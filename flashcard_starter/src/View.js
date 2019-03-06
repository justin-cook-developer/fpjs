import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { newCardMessage, editCardMessage } from './Update';

const { div, h1, form, label, input, h2, p, pre, a, button } = hh(h);

// UBIQUITOUS COMPONENTS
const deleteComponent = dispatch => button({ className: 'delete' }, 'X');

// EDIT MODE COMPONENTSe
const formGroup = (title, data) => div({ className: ''}, [
  label({ className: '', for: title}, title),
  input({ className: '', type: 'text', id: title }, data),
]);

const editForm  = (dispatch, card) => {
  return form({
    className: '',
    onsubmit: e => {
      e.prventDefault();
      console.dir(e.target);
    },
  },
  [
    formGroup('Question', card.question),
    formGroup('Answer', card.answer),
    button({ className: '', type: 'submit' }, 'Update Card'),
  ]);
}

const editMode = (dispatch, card) => {
  return div({ className: '' }, [
    editForm(dispatch, card),
  ]);
}

// QUESTION MODE COMPONENTS
const answerLinkComponent = dispatch => a({ className: 'answerLink' }, 'Show me the answer');

const showQuestionComponent = (dispatch, model) => {
  return div({ className: 'questionBox' }, [
    h2({ className: 'questionLabel' }, 'Question'),
    p({ className: 'question' }, model.question)
  ]);
}

const questionMode = (dispatch, card) => {
  return div({ className: 'cardBox' }, [
    deleteComponent(dispatch),
    showQuestionComponent(dispatch, card),
    answerLinkComponent(dispatch)
  ]);
}

// GENERAL DISPLAY COMPONENTS
const determineDisplayMode = (dispatch, card) => {
  switch(card.displayMode) {
    case 'question':
      return questionMode(dispatch, card);
    case 'edit':
      return editMode(dispatch, card);
    default:
      return questionMode(dispatch, card);
  }
}

const displayCards = (dispatch, cards) => {
  return R.pipe(
    R.map(
      R.partial(determineDisplayMode, [dispatch]),
    ),
    R.partial(div, [{ className: 'cardContainer' }]),
  )(cards);
}

function view(dispatch, model) {
  return div({ className: 'mw8 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
    button({
      className: 'addButton',
      onclick: e => dispatch(newCardMessage),
    },
    'Add a card'
    ),
    displayCards(dispatch, model.cards),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
