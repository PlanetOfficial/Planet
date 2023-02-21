import {CustomCallsURL} from '../APIConstants';

export const getCategories = async (genreId: number) => {
  // TODO: filter inputs**

  const response = await fetch(
    CustomCallsURL + `/request_categories_of_genre?genre_id=${genreId}`,
    {
      method: 'GET',
    },
  );

  const myJson = await response.json(); //extract JSON from the http response

  return myJson;
};
