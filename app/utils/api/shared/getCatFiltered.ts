import {addDaysToToday} from '../../functions/Misc';
import {CustomCallsURL} from '../APIConstants';

export const getCatFiltered = async (
  subcategories: Array<number>,
  count: number,
  latitude: number,
  longitude: number,
  daysUpperBound: number,
  radius: number,
  category_id: number,
  sortByDistance: boolean,
) => {
  // TODO: filter inputs**

  let subcategoryString = '';

  subcategories.forEach(item => {
    subcategoryString += `subcategories_ids[]=${item}&`;
  });

  const dateString = addDaysToToday(daysUpperBound);

  const response = await fetch(
    CustomCallsURL +
      `/category_filter?${subcategoryString}count=${count}&latitude=${latitude}&longitude=${longitude}&latest_event_date=${dateString}&radius=${radius}&category_id=${category_id}&sort_by_distance=${sortByDistance}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return [];
  }
};
