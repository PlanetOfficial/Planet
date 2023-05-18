import {DBOpsURL} from '../APIConstants';

export const getEvents = async (authToken: any) => {
  

  const response = await fetch(DBOpsURL + `/history?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return [];
  }
};
