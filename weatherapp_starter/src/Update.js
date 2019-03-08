import * as R from 'ramda';

const MESSAGES = {
  location_input: 'location_input',
  new_location: 'new_location',
  delete_location: 'delete_location',
  server_success: 'server_success'
};

// SERVER UTILITIES
//  You will need to substitute your own API key
const applicationID = '0efce3651e99c343f70604d40d63b809';

function whetherAddress(city) {
  return `http://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${applicationID}`;
}

// ACTION CREATORS
export const newLocationMessage = { type: MESSAGES.new_location };

export const getLocationInput = nextLocation => ({
  type: MESSAGES.location_input,
  nextLocation,
});

export const deleteLocationMessage = id => ({
  type: MESSAGES.delete_location,
  id
});

const serverSuccessMessage = R.curry((id, response) => ({
  type: MESSAGES.server_success,
  id,
  response
}));


function update(message, model) {
  switch(message.type) {
    case MESSAGES.new_location: {
      const { nextId, nextLocation, cities } = model;
      const newCity = makeNewCity(nextLocation, nextId);
      return [
        { nextId: nextId + 1, nextLocation: '', cities: [...cities, newCity] },
        {
          request: { url: whetherAddress(nextLocation) },
          successMessage: serverSuccessMessage(nextId),
        },
      ];
    }
    case MESSAGES.location_input: {
      const { nextLocation } = message;
      return { ...model, nextLocation };
    }
    case MESSAGES.delete_location: {
      const filteredCities = model.cities.filter(city => city.id !== message.id);
      return { ...model, cities: filteredCities };
    }
    case MESSAGES.server_success: {
      const { id, response } = message;
      const { cities } = model;
      const { temp, temp_min, temp_max } = R.pathOr(
        {},
        ['data', 'main'],
        response,
      );

      const updatedCities = cities.map(city => {
        if (city.id === id) {
          return {
            ...city,
            temperature: Math.round(temp),
            low: Math.round(temp_min),
            high: Math.round(temp_max),
          }
        }
        return city;
      });

      return { ...model, cities: updatedCities };
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
