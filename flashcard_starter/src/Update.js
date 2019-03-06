import * as R from 'ramda';

const MESSAGES = {
  new_card: 'new_card',
  edit_card: 'edit_card',
};

export const newCardMessage = { type: MESSAGES.new_card };

export const editCardMessage = (id, question, answer) => ({
  type: MESSAGES.edit_card,
  id,
  question,
  answer,
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
    default:
      return model;
  }
}

function updateCard(card, message) {
  const { question, answer, id } = message;
  return { ...card, question, answer, id };
}

export default update;
