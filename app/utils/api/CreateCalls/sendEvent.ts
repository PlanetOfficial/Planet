import {DBOpsURL} from '../APIConstants';

export const sendEvent = async (name: String, place_ids: Array<number>, authToken, date) => {
  // TODO: filter inputs**

  let placesString = '';

  place_ids.forEach(item => {
    placesString += `place_id[]=${item}&`;
  })

  const response = await fetch(
    DBOpsURL + `/event?${placesString}authtoken=${authToken}&name=${name}`,
    {
      method: 'POST',
    },
  );

  return response.status;
};
