import {APIURL} from '../api/APIConstants';

export const login = async (email: String, password: String) => {
  // TODO: filter inputs**

  const response = await fetch(
    APIURL + `/auth/login?email=${email}&password=${password}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json(); //extract JSON from the http response

  return myJson;
};
