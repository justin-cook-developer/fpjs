import * as R from 'ramda';

const MESSAGES = {
  input_left: 'input_left',
  input_right: 'input_right',
  select_left: 'select_left',
  select_right: 'select_right',
};

const change = type => value => ({ type, value });

export const takeLeftInput = change(MESSAGES.input_left);
export const takeRightInput = change(MESSAGES.input_right);

export const unitChangeLeft = change(MESSAGES.select_left);
export const unitChangeRight = change(MESSAGES.select_right);


function update (msg, model) {
  switch(msg.type) {
    case MESSAGES.input_left: {
      const { value } = msg;
      if(value === '') {
        return {...model, sourceLeft: true, leftFieldValue: '', rightFieldValue: '' };
      }
      const leftFieldValue = toInt(value);
      return convert({ ...model, sourceLeft: true, leftFieldValue });
    }
    case MESSAGES.input_right: {
      const { value } = msg;
      if(value === '') {
        return {...model, sourceLeft: false, leftFieldValue: '', rightFieldValue: '' };
      }
      const rightFieldValue = toInt(value);
      return convert({ ...model, sourceLeft: false, rightFieldValue });
    }
    case MESSAGES.select_left: {
      const { value } = msg;
      return convert({ ...model, leftUnits: value });
    }
    case MESSAGES.select_right: {
      const { value } = msg;
      return convert({ ...model, rightUnits: value });
    }
    default:
      return model;
  }
}


function toInt(val) {
  return R.pipe(
  parseInt,
  R.defaultTo(0)
  )(val);
}

function FtoC(degrees) {
  return (degrees - 32)  * (5 / 9);
}

function CtoF(degrees) {
  return (degrees / (5 / 9)) + 32;
}

function CtoK(degrees) {
  return degrees + 273.15;
}

function KtoC(degrees) {
  return degrees - 273.15;
}

const FtoK = R.pipe(FtoC, CtoK);

const KtoF = R.pipe(KtoC, CtoF);

const conversions = {
  Fahrenheit: {
    Celsius: FtoC,
    Kelvin: FtoK,
  },
  Celsius: {
    Fahrenheit: CtoF,
    Kelvin: CtoK,
  },
  Kelvin: {
    Fahrenheit: KtoF,
    Celsius: KtoC,
  },
};

function convertFromToTemp(valFrom, unitFrom, unitTo) {
  const convertFunction = conversions[unitFrom][unitTo] || (val => val);
  return Math.round(convertFunction(valFrom));
}

function convert(model) {
  const { rightFieldValue, leftFieldValue, leftUnits, rightUnits, sourceLeft } = model;

  const [valueFrom, unitsFrom, unitsTo] = sourceLeft
    ? [leftFieldValue, leftUnits, rightUnits]
    : [rightFieldValue, rightUnits, leftUnits];

  const otherVal = convertFromToTemp(valueFrom, unitsFrom, unitsTo);

  return sourceLeft
    ? { ...model, rightFieldValue: otherVal }
    : { ...model, leftFieldValue: otherVal };
}

export default update;
