import {EndPointsURL} from '../APIConstants';
import {Event} from '../../interfaces/types';

export const getEvents = async (authToken: string): Promise<Event[]> => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    EndPointsURL + `/events?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    console.log('myJson', myJson);
    return myJson;
  } else {
    return [];
  }
};
