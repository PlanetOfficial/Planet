import {DBOpsURL} from '../APIConstants';

export const getEventPlaces = async (event_id: number) => {
  // TODO: filter inputs**

  const response = await fetch(DBOpsURL + `/event/${event_id}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return {};
  }
};
