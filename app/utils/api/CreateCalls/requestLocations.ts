import {CustomCallsURL} from '../APIConstants';

export const requestLocations = async (
  categories: Array<number>,
  radius: number,
  latitude: number,
  longitude: number,
  count: number,
) => {
  // TODO: filter inputs**

  let categoryString = '';

  categories.forEach(item => {
    categoryString += `categories_ids[]=${item}&`;
  });

  const response = await fetch(
    CustomCallsURL +
      `/location_list?${categoryString}radius=${radius}&ll=${latitude},${longitude}&count=${count}`,
    {
      method: 'GET',
    },
  );

  const myJson = await response.json(); //extract JSON from the http response

  return myJson?.destinations;
};
