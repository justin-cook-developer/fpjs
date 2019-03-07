import * as R from 'ramda';

const MESSAGES = {
  location_input: 'location_input',
  new_location: 'new_location',
  delete_location: 'delete_location',
};

export const newLocationMessage = { type: MESSAGES.new_location };

export const getLocationInput = nextLocation => ({
  type: MESSAGES.location_input,
  nextLocation,
});

export const deleteLocationMessage = id => ({
  type: MESSAGES.delete_location,
  id
});

function update(message, model) {
  switch(message.type) {
    case MESSAGES.new_location: {
      const { nextId, nextLocation, cities } = model;
      const newCity = makeNewCity(nextLocation, nextId);
      return { nextId: nextId + 1, nextLocation: '', cities: [...cities, newCity] };
    }
    case MESSAGES.location_input: {
      const { nextLocation } = message;
      return { ...model, nextLocation };
    }
    case MESSAGES.delete_location: {
      const filteredCities = model.cities.filter(city => city.id !== message.id);
      return { ...model, cities: filteredCities };
    }
    default:
      return model;
  }
}

function makeNewCity(name, id) {
  return {
    id,
    name,
    temperature: null,
    low: null,
    high: null,
  }
}

export default update;
