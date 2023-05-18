import {DBOpsURL} from '../APIConstants';

export const getGenres = async () => {
  

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
