import {DBOpsURL} from '../APIConstants';

export const getEvents = async (authToken: any) => {
  // TODO: filter inputs**

  const response = await fetch(DBOpsURL + `/history?authtoken=${authToken}`, {
    method: 'GET',
  });

  const myJson = await response.json(); //extract JSON from the http response

  return myJson;
};
