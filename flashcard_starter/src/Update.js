import * as R from 'ramda';

const MESSAGES = {
  new_card: 'new_card',
  edit_card: 'edit_card',
  edit_card_mode: 'edit_card_mode',
  delete_card: 'delete_card',
  answer_card_mode: 'answer_card_mode',
  reset_rank: 'reset_rank',
  update_rank: 'update_rank',
};

export const newCardMessage = { type: MESSAGES.new_card };

export const enterEditModeMessage = id => ({
  type: MESSAGES.edit_card_mode,
  id
});

export const editCardMessage = (id, question, answer) => ({
  type: MESSAGES.edit_card,
  id,
  question,
  answer,
});

export const enterAnswerModeMessage = id => ({
  type: MESSAGES.answer_card_mode,
  id
});

export const resetRank = id => ({
  type: MESSAGES.reset_rank,
  id
});

export const updateRank = (amount, id) => ({
  type: MESSAGES.update_rank,
  id,
  amount,
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
      const updatedDisplayMode = cards.map(card => card.id === message.id ? changeDisplayMode(card, 'edit') : card);
      return { cards: updatedDisplayMode, nextId };
    }
    case MESSAGES.answer_card_mode: {
      const { cards, nextId } = model;
      const updatedDisplayMode = cards.map(card => card.id === message.id ? changeDisplayMode(card, 'answer') : card);
      return { cards: updatedDisplayMode, nextId };
    }
    case MESSAGES.reset_rank: {
      const { cards, nextId } = model;
      const updatedRank = cards.map(card => card.id === message.id ? updateRankState(card, 0) : card);
      const sortedByRank = updatedRank.sort((a, b) => a.rank - b.rank);
      return { cards: sortedByRank, nextId };
    }
    case MESSAGES.update_rank: {
      const { cards, nextId } = model;
      const updatedRank = cards.map(card => card.id === message.id ? updateRankState(card, card.rank + message.amount) : card);
      const sortedByRank = updatedRank.sort((a, b) => a.rank - b.rank);
      return { cards: sortedByRank, nextId };
    }
    case MESSAGES.delete_card: {
      const { cards, nextId } = model;
      const filteredCards = cards.filter(card => card.id !== message.id);
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

function changeDisplayMode(card, mode) {
  return { ...card, displayMode: mode };
}

function updateRankState(card, value) {
  return { ...card, rank: value, displayMode: 'question' };
}

export default update;
