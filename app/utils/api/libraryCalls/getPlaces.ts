import {DBOpsURL} from '../APIConstants';

export const getPlaces = async (authToken: any) => {
  // TODO: filter inputs**

  const response = await fetch(DBOpsURL + `/saved?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return [];
  }
};
