import {UserOpsURL} from './APIConstants';

export const login = async (email: string, password: string) => {
  const response = await fetch(
    UserOpsURL + `/auth/login?email=${email}&password=${password}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json();

  return myJson;
};

export const signup = async (name: string, email: string, password: string) => {
  const response = await fetch(
    UserOpsURL +
      `/auth/signup?name=${name}&email=${email}&password=${password}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json();

  return myJson;
};

export const getUserInfo = async (authToken: string) => {
  const response = await fetch(UserOpsURL + `/auth/me?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json();

    return myJson;
  } else {
    return {};
  }
};
