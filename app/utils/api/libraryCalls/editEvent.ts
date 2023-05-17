import {DBOpsURL} from '../APIConstants';

export const editEvent = async (
  name: String,
  date: string,
  place_ids: number[],
  event_id: number,
) => {
  // TODO-SECURITY: filter inputs**

  let placesString = '';

  place_ids.forEach(item => {
    placesString += `place_id[]=${item}&`;
  });

  const response = await fetch(
    DBOpsURL +
      `/event/editEvent?${placesString}name=${name}&date=${date}&event_id=${event_id}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
