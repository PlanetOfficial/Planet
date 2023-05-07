import {DBOpsURL} from '../APIConstants';

export const getGenres = async () => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(DBOpsURL + '/category', {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return [];
  }
};
