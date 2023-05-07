import {DBOpsURL} from '../APIConstants';

export const getFGsAndInvites = async (authToken: any) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    DBOpsURL + `/friends/groupsAndInvites?authtoken=${authToken}`,
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
