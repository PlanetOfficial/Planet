import {UserOpsURL} from '../APIConstants';

export const getUserInfo = async (authToken: any) => {
  // TODO: filter inputs**

  const response = await fetch(UserOpsURL + `/auth/me?authtoken=${authToken}`, {
    method: 'GET',
  });

  const myJson = await response.json(); //extract JSON from the http response

  return myJson;
};
