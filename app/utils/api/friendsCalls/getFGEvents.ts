import {DBOpsURL} from '../APIConstants';

export const getFGEvents = async (group_id: number, authToken: any) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    DBOpsURL + `/friends/fgEvents?group_id=${group_id}&authtoken=${authToken}`,
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
