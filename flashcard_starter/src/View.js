import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

import { newCardMessage, editCardMessage, enterDisplayMode, deleteCardMessage, updateRank } from './Update';

const { div, h1, form, label, input, h2, p, pre, a, button } = hh(h);


// ---------- REUSABLE COMPONENTS ----------
const deleteComponent = (dispatch, id) => button({
  className: 'delete',
  onclick: _ => dispatch(deleteCardMessage(id))
}, 'X');

const showDataComponent = (dispatch, card, title, dispatchMessage = null) => {
  return div({
    className: 'questionBox',
    onclick: _ => {
      if (dispatchMessage) {
        dispatch(dispatchMessage);
      }
    },
  },
  [
    h2({ className: 'questionLabel' }, title),
    p({ className: 'question' }, card[title.toLowerCase()
    ])
  ]);
}


// ---------- EDIT MODE COMPONENTS ----------
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


// ---------- ANSWER MODE COMPONENTS ----------
const rankButton = (dispatch, id, handleRank, classes, text) => {
  return button({
    className: `${classes}`,
    onclick: _ => dispatch(handleRank(id))
  }, text);
}

const selfFeedbackButtons = (dispatch, id) => {
  return div({ className: '' }, [
    rankButton(dispatch, id, R.partial(updateRank, [undefined]), '', 'Bad'),
    rankButton(dispatch, id, R.partial(updateRank, [1]), '', 'Good'),
    rankButton(dispatch, id, R.partial(updateRank, [2]), '', 'Great'),
  ]);
}

const answerMode = (dispatch, card) => {
  return div({ className: '' }, [
    showDataComponent(dispatch, card, 'Question', enterDisplayMode(card.id, 'edit')),
    showDataComponent(dispatch, card, 'Answer'),
    selfFeedbackButtons(dispatch, card.id),
  ]);
}


// ---------- QUESTION MODE COMPONENTS ----------
const answerLinkComponent = (dispatch, id) => a({
  className: 'answerLink',
  onclick: _ => dispatch(enterDisplayMode(id, 'answer')),
}, 'Show me the answer');

const questionMode = (dispatch, card) => {
  return div({ className: '' }, [
    showDataComponent(dispatch, card, 'Question', enterDisplayMode(card.id, 'edit')),
    answerLinkComponent(dispatch, card.id),
  ]);
}


// ---------- GENERAL DISPLAY COMPONENTS ----------
const cardDisplay = (dispatch, card, displayMode) => {
  return div({ className: 'cardBox' }, [
    deleteComponent(dispatch, card.id),
    displayMode(dispatch, card),
  ]);
}

const determineDisplayMode = (dispatch, card) => {
  switch(card.displayMode) {
    case 'question':
      return cardDisplay(dispatch, card, questionMode);
    case 'edit':
      return cardDisplay(dispatch, card, editMode);
    case 'answer':
      return cardDisplay(dispatch, card, answerMode);
    default:
      return cardDisplay(dispatch, card, questionMode);
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
    // pre(JSON.stringify(model, null, 2)),*
  ]);
}

export default view;
