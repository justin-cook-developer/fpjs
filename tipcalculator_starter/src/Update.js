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
      return changeComputedValues({ ...model, bill: value });
    }
    case MESSAGES.percent_change: {
      const { value } = msg;
      return changeComputedValues({ ...model, tipPercentage: value });
    }
    default:
      return model;
  }
}

function toFloat(value) {
  return R.pipe(
    parseFloat,
    R.defaultTo(0)
  )(value);
}

function getFloats(values) {
  return values.map(toFloat);
}

function changeComputedValues(model) {
  const { bill, tipPercentage } = model;
  const [floatBill, floatPercentage] = getFloats([bill, tipPercentage]);

  const tipAmount = (floatBill * (floatPercentage / 100));
  const totalAmount = floatBill + tipAmount;
  
  const tip = tipAmount.toFixed(2);
  const total = totalAmount.toFixed(2);

  return { ...model, total, tipAmount: tip };
}

export default update;
