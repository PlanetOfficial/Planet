import {DBOpsURL} from '../APIConstants';

export const getPlaceDetails = async (placeId: any) => {
  

  const response = await fetch(DBOpsURL + `/place_v3/${placeId}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return {};
  }
};
