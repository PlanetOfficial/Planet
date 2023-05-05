import {integers} from '../../../constants/numbers';
import {addDaysToToday} from '../../functions/Misc';
import {CustomCallsURL} from '../APIConstants';

export const requestLocations = async (
  categories: number[],
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

  const dateString = addDaysToToday(integers.defaultDaysToAdds);

  const response = await fetch(
    CustomCallsURL +
      `/location_list_v2?${categoryString}radius=${radius}&latitude=${latitude}&longitude=${longitude}&count=${count}&latest_event_date=${dateString}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    console.log('myJson', myJson);
    return myJson?.places;
  } else {
    return {};
  }
};
