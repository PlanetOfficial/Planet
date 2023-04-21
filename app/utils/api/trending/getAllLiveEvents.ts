import {CustomCallsURL} from '../APIConstants';
import { genres } from '../../../constants/genres';
import { addDaysToToday } from '../../functions/Misc';
import { integers } from '../../../constants/numbers';

export const getAllLiveEvents = async (latitude: number, longitude: number, radius: number, count: number) => {
  // TODO: filter inputs**

  let categoryString = '';
  genres[0].categories.forEach(liveEventCategory => {
    categoryString += `categories_ids[]=${liveEventCategory.id}&`;
  });

  const dateString = addDaysToToday(integers.defaultDaysToAdds);

  const response = await fetch(CustomCallsURL + `/liveEvents?${categoryString}latitude=${latitude}&longitude=${longitude}&radius=${radius}&latest_event_date=${dateString}&count=${count}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return [];
  }
};
