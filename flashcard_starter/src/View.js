import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';

const { div, h1, label, input, h2, p, pre, a, button } = hh(h);

// UBIQUITOUS COMPONENTS
const deleteComponent = dispatch => button({ className: 'delete' }, 'X');

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
    default:
      return questionMode(dispatch, card);
  }
}

const displayCards = (dispatch, cards) => {
  return R.pipe(
    R.map(
      R.partial(determineDisplayMode, [dispatch]),
    ),
    div
  )(cards);
}

function view(dispatch, model) {
  return div({ className: 'mw8 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Flashcard Study'),
    displayCards(dispatch, model.cards),
    pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
