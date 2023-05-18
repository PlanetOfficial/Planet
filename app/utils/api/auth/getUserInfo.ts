import {UserOpsURL} from '../APIConstants';

export const getUserInfo = async (authToken: any) => {
  

  const response = await fetch(UserOpsURL + `/auth/me?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json(); //extract JSON from the http response

    return myJson;
  } else {
    return {};
  }
};
