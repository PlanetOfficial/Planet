import {DBOpsURL} from '../APIConstants';

export const getGroupEventPlaces = async (group_event_id: number) => {
  // TODO: filter inputs**

  const response = await fetch(
    DBOpsURL + `/friends/event?group_event_id=${group_event_id}`,
    {
      method: 'GET',
    },
  );

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response
    return myJson;
  } else {
    return {};
  }
};
