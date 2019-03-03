import * as R from 'ramda';

const MESSAGES = {
  show_form: 'show_form',
  meal_input: 'meal_input',
  calories_input: 'calories_input',
  save_meal: 'save_meal',
  delete_meal: 'delete_meal',
  edit_meal: 'edit_meal',
};

export function showFormMessage(showForm) {
  return {
    type: MESSAGES.show_form,
    showForm
  }
}

export function mealInputMessage(description) {
  return {
    type: MESSAGES.meal_input,
    description,
  };
}

export function caloriesInputMessage(calories) {
  return {
    type: MESSAGES.calories_input,
    calories
  };
}

export const saveMealMessage = { type: MESSAGES.save_meal };

export function deleteMealMessage(id) {
  return {
    type: MESSAGES.delete_meal,
    id
  };
}

export function editMealMessage(editId) {
  return {
    type: MESSAGES.edit_meal,
    editId,
  };
}

function update(message, model) {
  switch(message.type) {
    case MESSAGES.show_form: {
      const { showForm } = message;
      return { ...model, showForm, description: '', calories: 0 };
    }
    case MESSAGES.meal_input: {
      const { description } = message;
      return { ...model, description };
    }
    case MESSAGES.calories_input: {
      const calories = R.pipe(
        parseInt,
        R.defaultTo(0),
      )(message.calories);
      return { ...model, calories };
    }
    case MESSAGES.save_meal: {
      const { editId } = model;
      const updatedModel = editId !== null ?
        edit(message, model) :
        add(message, model);
      return updatedModel;
    }
    case MESSAGES.delete_meal: {
      const { id } = message;
      const meals = R.filter(
        meal => meal.id !== id,
        model.meals
      );
      return { ...model, meals };
    }
    case MESSAGES.edit_meal: {
      const { editId } = message;
      const meal = R.find(
        meal => meal.id === editId,
        model.meals
      );

      const { description, calories } = meal;

      return {
        ...model,
        editId,
        description,
        calories,
        showForm: true,
      };
    }
    default:
      return model;
  }
}

function add(message, model) {
  const { nextId, description, calories } = model;
  const meal = { id: nextId, description, calories };
  const meals = [...model.meals, meal];
  return {
    ...model,
    meals,
    nextId: nextId + 1,
    description: '',
    calories: 0,
    showForm: false,
  };
}

function edit(message, model) {
  const { description, calories, editId } = model;
  const meals = R.map(meal => {
    if (meal.id === editId) {
      return { ...meal, description, calories };
    } else {
      return meal;
    }
  }, model.meals);

  return {
    ...model,
    meals,
    description: '',
    calories: 0,
    editId: null,
    showForm: false,
  };
}

export default update;
