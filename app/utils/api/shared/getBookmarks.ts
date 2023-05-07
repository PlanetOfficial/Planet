import {DBOpsURL} from '../APIConstants';

export const getBookmarks = async (authToken: any) => {
  // TODO-SECURITY: filter inputs**

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
