import EncryptedStorage from 'react-native-encrypted-storage';
import {UserAPIURL} from './APIConstants';
import {UserInfo} from '../types';

export const login = async (username: string, password: string) => {
  const response = await fetch(
    UserAPIURL + `/auth/login?username=${username}&password=${password}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json();

  return myJson;
};

export const signup = async (
  first_name: string,
  last_name: string,
  username: string,
  password: string,
) => {
  const response = await fetch(
    UserAPIURL +
      `/auth/signup?first_name=${first_name}&last_name=${last_name}&username=${username}&password=${password}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json();

  return myJson;
};

export const sendCode = async (authToken: string, phone_number: string) => {
  const response = await fetch(
    UserAPIURL +
      `/auth/sendCode?phone_number=${phone_number}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

export const verifyCode = async (authToken: string, code: string) => {
  const response = await fetch(
    UserAPIURL + `/auth/verifyCode?code=${code}&authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

export const sendMoreInfo = async (
  authToken: string,
  age: string,
  gender: string,
) => {
  const response = await fetch(
    UserAPIURL +
      `/auth/moreInfo?authtoken=${authToken}&age=${age}&gender=${gender}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};

export const getUserInfo = async (
  authToken: string,
): Promise<UserInfo | undefined> => {
  const response = await fetch(UserAPIURL + `/auth/me?authtoken=${authToken}`, {
    method: 'GET',
  });

  if (response?.ok) {
    const myJson = await response.json();

    return myJson;
  } else {
    return undefined;
  }
};

export const isVerified = async (authToken: string) => {
  const response = await fetch(
    UserAPIURL + `/auth/isVerified?authtoken=${authToken}`,
    {
      method: 'GET',
    },
  );

  const myJson = await response.json();

  return myJson?.verified;
};

export const saveTokenToDatabase = async (fcm_token: string) => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return;
  }

  const response = await fetch(
    UserAPIURL +
      `/firebase/updateToken?authtoken=${authToken}&token=${fcm_token}`,
    {
      method: 'POST',
    },
  );

  const myJson = await response.json();

  return myJson;
};
