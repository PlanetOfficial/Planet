import {DBOpsURL} from '../APIConstants';

export const sendEvent = async (
  name: String,
  place_ids: number[],
  authToken: string | null,
  date: string,
) => {
  // TODO: filter inputs**

  let placesString = '';

  place_ids.forEach(item => {
    placesString += `place_id[]=${item}&`;
  });

  const response = await fetch(
    DBOpsURL +
      `/event?${placesString}authtoken=${authToken}&name=${name}&date=${date}`,
    {
      method: 'POST',
    },
  );

  return response?.ok;
};
