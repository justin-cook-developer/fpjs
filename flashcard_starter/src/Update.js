import * as R from 'ramda';

const MESSAGES = {
  new_card: 'new_card',
  edit_card: 'edit_card',
  edit_card_mode: 'edit_card_mode',
  delete_card: 'delete_card',
};

export const newCardMessage = { type: MESSAGES.new_card };

export const editCardMessage = (id, question, answer) => ({
  type: MESSAGES.edit_card,
  id,
  question,
  answer,
});

export const enterEditModeMessage = id => ({
  type: MESSAGES.edit_card_mode,
  id
});

export const deleteCardMessage = id => ({
  type: MESSAGES.delete_card,
  id
});

function update(message, model) {
  switch(message.type) {
    case MESSAGES.new_card: {
      const newCard = { question: '', answer: '', displayMode: 'edit', rank: 0, id: model.nextId };
      return {
        cards: [newCard, ...model.cards],
        nextId: model.nextId + 1,
      };
    }
    case MESSAGES.edit_card: {
      const { nextId, cards } = model;
      const updatedCards = cards.map(card => card.id === message.id ? updateCard(card, message) : card);
      return { cards: updatedCards, nextId, };
    }
    case MESSAGES.edit_card_mode: {
      const { cards, nextId } = model;
      const updatedDisplayMode = cards.map(card => card.id === message.id ? changeToEditMode(card) : card);
      return { cards: updatedDisplayMode, nextId };
    }
    case MESSAGES.delete_card: {
      const { cards, nextId } = model;
      console.log('----', message.id)
      const filteredCards = cards.filter(card => card.id !== message.id);
      console.log(filteredCards)
      return { cards: filteredCards, nextId };
    }
    default:
      return model;
  }
}

function updateCard(card, message) {
  const { question, answer } = message;
  return { ...card, question, answer, displayMode: 'question' };
}

function changeToEditMode(card) {
  return { ...card, displayMode: 'edit' };
}

export default update;
