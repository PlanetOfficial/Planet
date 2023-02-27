import {DBOpsURL} from '../APIConstants';

export const getCategories = async (genreId: number) => {
  // TODO: filter inputs**

  const response = await fetch(DBOpsURL + `/categories/${genreId}`, {
    method: 'GET',
  });

  const myJson = await response.json(); //extract JSON from the http response

  return myJson;
};
