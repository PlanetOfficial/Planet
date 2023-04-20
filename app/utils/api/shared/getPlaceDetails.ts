import {DBOpsURL} from '../APIConstants';

export const getPlaceDetails = async (placeId: any) => {
  // TODO: filter inputs**

  const response = await fetch(DBOpsURL + `/place/${placeId}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return [];
  }
};
