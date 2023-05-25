import EncryptedStorage from 'react-native-encrypted-storage';
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

export const saveTokenToDatabase = async (fcm_token: string) => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    console.log('No auth token yet, will not add fcm to firebase.');
    return;
  }

  const response = await fetch(
    UserOpsURL +
      `/firebase/updateToken?authtoken=${authToken}&token=${fcm_token}`,
    {
      method: 'POST',
    },
  );

  if (response?.ok) {
    console.log('Successfully saved fcm token for user');
  } else {
    console.warn('Error: could not set fcm token for user');
  }
};
