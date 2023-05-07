import {DBOpsURL} from '../APIConstants';

export const getGroupEventPlaces = async (group_event_id: number) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    DBOpsURL + `/groupEvent?group_event_id=${group_event_id}`,
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
