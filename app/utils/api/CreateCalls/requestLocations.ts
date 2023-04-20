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

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 14);
  const dateString = currentDate.toISOString().slice(0, 10);

  const response = await fetch(
    CustomCallsURL +
      `/location_list_v2?${categoryString}radius=${radius}&latitude=${latitude}&longitude=${longitude}&count=${count}&latest_event_date=${dateString}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson?.places;
  } else {
    return {};
  }
};
