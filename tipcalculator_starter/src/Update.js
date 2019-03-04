import * as R from 'ramda';

const MESSAGES = {
  bill_change: 'bill_change',
  percent_change: 'percent_change',
};

const makeActionCreator = type => value => ({ type, value });

export const billChangeCreator = makeActionCreator(MESSAGES.bill_change);
export const percentChangeCreator = makeActionCreator(MESSAGES.percent_change);

function update (msg, model) {
  switch(msg.type) {
    case MESSAGES.bill_change: {
      const { value } = msg;
      return { ...model, bill: value };
    }
    case MESSAGES.percent_change: {
      const { value } = msg;
      return { ...model, tipPercentage: value };
    }
    default:
      return model;
  }
}

export default update;
