import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { newCardMessage, editCardMessage, enterEditModeMessage, deleteCardMessage } from './Update';

const { div, h1, form, label, input, h2, p, pre, a, button } = hh(h);

// UBIQUITOUS COMPONENTS
const deleteComponent = (dispatch, id) => button({
  className: 'delete',
  onclick: _ => dispatch(deleteCardMessage(id))
}, 'X');

// EDIT MODE COMPONENTSe
const formGroup = (title, value) => div({ className: ''}, [
  label({ className: '', for: title}, title),
  input({ className: '', type: 'text', id: title, value }),
]);

const editForm  = (dispatch, card) => {
  return form({
    className: '',
    onsubmit: e => {
      e.preventDefault();
      const question = e.target.childNodes[0].childNodes[1].value;
      const answer = e.target.childNodes[1].childNodes[1].value;
      dispatch(editCardMessage(card.id, question, answer));
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

// QUESTIO2N MODE COMPONENTS
const answerLinkComponent = dispatch => a({ className: 'answerLink' }, 'Show me the answer');

const showQuestionComponent = (dispatch, card) => {
  return div({
    className: 'questionBox',
    onclick: _ => dispatch(enterEditModeMessage(card.id)),
  },
  [
    h2({ className: 'questionLabel' }, 'Question'),
    p({ className: 'question' }, card.question)
  ]);
}

const questionMode = (dispatch, card) => {
  return div({ className: 'cardBox' }, [
    deleteComponent(dispatch, card.id),
    showQuestionComponent(dispatch, card),
    answerLinkComponent(dispatch),
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
      onclick: _ => dispatch(newCardMessage),
    },
    'Add a card'
    ),
    displayCards(dispatch, model.cards),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
