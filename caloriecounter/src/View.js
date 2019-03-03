import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import * as R from 'ramda';
import { showFormMessage, mealInputMessage, caloriesInputMessage, saveMealMessage, deleteMealMessage, editMealMessage } from './Update';

const { pre, div, h1, button, form, input, label, table, thead, tbody, tr, td, th, i } = hh(h);

function fieldSet(dispatch, labelText, inputValue, oninput) {
  return div([
    label({ className: 'db mb1' }, labelText),
    input({
      className: 'pa2 input-reset ba w-100 mb2',
      type: 'text',
      value: inputValue,
      oninput: e => dispatch(oninput(e.target.value))
    }),
  ]);
}

function buttonSet(dispatch) {
  return div([
    button(
      {
        className: 'f3 pv2 ph3 bg-blue white bn mr2 dim',
        type: 'submit',
      },
      'Save',
    ),
    button(
      {
        className: 'f3 pv2 ph3 bn bg-light-gray dim',
        type: 'button',
        onclick: () => dispatch(showFormMessage(false)),
      },
      'Cancel',
    )
  ])
}

function formView(dispatch, model) {
  const { description, calories, showForm } = model;
  if (showForm) {
    return form(
      {
        className: 'w-100 mv2',
        onsubmit: e => {
          e.preventDefault();
          dispatch(saveMealMessage);
        }
      },
      [
        fieldSet(dispatch, 'Meal', description, mealInputMessage),
        fieldSet(dispatch, 'Calories', calories || '', caloriesInputMessage),
        buttonSet(dispatch),
      ],
    );
  } else {
    return button(
      { className: 'f3 pv2 ph3 bg-blue white bn',
        onclick: () => dispatch(showFormMessage(true)),
      },
      'Add Meal',
    );
  }
}

const cell = (tag, className, data) => tag({ className }, data);

const tableHeader = thead([
  tr([
    cell(th, 'pa2 tl', 'Meal'),
    cell(th, 'pa2 tr', 'Calories'),
    cell(th, '', '')
  ]),
]);


const mealRow = (dispatch, className, meal) => tr({ className }, [
  cell(td, 'pa2', meal.description),
  cell(td, 'pa2 tr', meal.calories),
  cell(td, 'pa2 tr', [
    i({
      className: 'ph1 fa fa-trash-o pointer',
      onclick: () => dispatch(deleteMealMessage(meal.id)),
    }),
    i({
      className: 'ph1 fa fa-pencil-square-o pointer',
      onclick: () => dispatch(editMealMessage(meal.id)),
    })
  ]),
]);

const calculateTotal = R.pipe(
  R.map(meal => meal.calories),
  R.sum,
);

const totalRow = meals => {
  const total = calculateTotal(meals);
  return tr({ className: 'bt b' }, [
    cell(td, 'pa2 tl', 'Total:'),
    cell(td, 'pa2 tr', total),
  ]);
};

const mealsBody = (dispatch, className, meals) => {
  const rose = R.map(
    R.partial(mealRow, [dispatch, 'stripe-dark']),
    meals,
  );

  const bodyRose = [...rose, totalRow(meals)];

  return tbody({ className }, bodyRose);
}

const tableView = (dispatch, meals) => {
  if (meals.length === 0) {
    return div({ className: 'mv2 i black-50' }, 'No meals to display...');
  } else {
    return table({ className: 'mv2 w-100 collapse' }, [
      tableHeader,
      mealsBody(dispatch, '', meals),
    ]);
  }
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2  pv2 bb' }, 'Calorie Counter'),
    formView(dispatch, model),
    tableView(dispatch, model.meals),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;
