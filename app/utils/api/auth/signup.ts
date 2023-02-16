import {APIURL} from '../APIConstants';

export const signup = async (name: String, email: String, password: String) => {
  // TODO: filter inputs**

  const response = await fetch(
    APIURL + `/auth/signup?name=${name}&email=${email}&password=${password}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json(); //extract JSON from the http response

  return myJson;
};
