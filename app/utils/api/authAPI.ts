import EncryptedStorage from 'react-native-encrypted-storage';
import {UserAPIURL} from './APIConstants';
import {MyInfo} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const sendCodeUsername = async (username: string) => {
  const response = await fetch(
    UserAPIURL + `/auth/sendCodeUsername?username=${username}`,
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

export const verifyCodeUsername = async (username: string, code: string): Promise<{authToken: string} | null> => {
  const response = await fetch(
    UserAPIURL + `/auth/verifyCodeUsername?code=${code}&username=${username}`,
    {
      method: 'POST',
    },
  );

  if (response?.ok) {
    const myJson = await response.json();

    return myJson;
  } else {
    return null;
  }
};

export const resetPassword = async (authToken: string, password: string) => {
  const response = await fetch(
    UserAPIURL +
      `/auth/resetPassword?password=${password}&authtoken=${authToken}`,
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
): Promise<MyInfo | undefined> => {
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

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
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

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 * This sets the user's profile in the cache if a succesful response.
 */
export const saveImage = async (base64: string): Promise<string | null> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    UserAPIURL + `/auth/uploadImage?authtoken=${authToken}`,
    {
      method: 'POST',
      body: JSON.stringify({content: 'data:image/png;base64,' + base64}),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const myJson: {image_url: string} = await response.json();

  if (response?.ok) {
    await AsyncStorage.setItem('pfp_url', JSON.stringify(myJson.image_url));
    return myJson.image_url;
  } else {
    return null;
  }
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const editInfo = async (
  first_name: string,
  last_name: string,
  username: string,
  age: string,
  gender: string,
) => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return null;
  }

  const response = await fetch(
    UserAPIURL +
      `/auth/editInfo?authtoken=${authToken}&first_name=${first_name}&last_name=${last_name}&username=${username}&age=${age}&gender=${gender}`,
    {
      method: 'POST',
    },
  );

  return response;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const removeAccount = async (): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const response = await fetch(
    UserAPIURL + `/auth/removeAccount?authtoken=${authToken}`,
    {
      method: 'DELETE',
    },
  );

  return response.ok;
};
