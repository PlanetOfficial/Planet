import {UserOpsURL} from '../APIConstants';

export const login = async (email: String, password: String) => {
  // TODO-SECURITY: filter inputs**

  const response = await fetch(
    UserOpsURL + `/auth/login?email=${email}&password=${password}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json(); //extract JSON from the http response

  return myJson;
};
