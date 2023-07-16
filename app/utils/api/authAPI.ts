import EncryptedStorage from 'react-native-encrypted-storage';
import {UserAPIURL, XanoAPIKey} from './APIConstants';
import {MyInfo} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export const login = async (username: string, password: string) => {
  const response = await fetch(UserAPIURL + '/auth/login', {
    method: 'POST',
    body: JSON.stringify({username, password}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: XanoAPIKey,
    },
  });

  const myJson = await response.json();

  return myJson;
};

export const signup = async (
  first_name: string,
  last_name: string,
  username: string,
  password: string,
) => {
  const response = await fetch(UserAPIURL + '/auth/signup', {
    method: 'POST',
    body: JSON.stringify({first_name, last_name, username, password}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: XanoAPIKey,
    },
  });

  const myJson = await response.json();

  return myJson;
};

export const sendCode = async (authToken: string, phone_number: string) => {
  const response = await fetch(UserAPIURL + '/auth/sendCode', {
    method: 'POST',
    body: JSON.stringify({phone_number}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

  return response.ok;
};

export const sendCodeForgotPwd = async (username: string) => {
  const response = await fetch(UserAPIURL + '/auth/sendCodeForgotPwd', {
    method: 'POST',
    body: JSON.stringify({username}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: XanoAPIKey,
    },
  });

  return response.ok;
};

export const verifyCode = async (authToken: string, code: string) => {
  const response = await fetch(UserAPIURL + '/auth/verifyCode', {
    method: 'POST',
    body: JSON.stringify({code}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

  if (response.status === 429) {
    Alert.alert('Too many attempts, please try again tomorrow.');
  }

  return response.ok;
};

export const verifyCodeUsername = async (
  username: string,
  code: string,
): Promise<{authToken: string} | null> => {
  const response = await fetch(UserAPIURL + '/auth/verifyCodeUsername', {
    method: 'POST',
    body: JSON.stringify({code, username}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: XanoAPIKey,
    },
  });

  if (response.status === 429) {
    Alert.alert('Too many attempts, please try again tomorrow.');
  }

  if (response?.ok) {
    const myJson = await response.json();

    return myJson;
  } else {
    return null;
  }
};

export const resetPassword = async (authToken: string, password: string) => {
  const response = await fetch(UserAPIURL + '/auth/resetPassword', {
    method: 'POST',
    body: JSON.stringify({password}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

  return response.ok;
};

export const sendMoreInfo = async (
  authToken: string,
  age: string,
  gender: string,
) => {
  const response = await fetch(UserAPIURL + '/auth/moreInfo', {
    method: 'POST',
    body: JSON.stringify({age, gender}),
    headers: {
      'Content-Type': 'application/json',
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

  return response.ok;
};

export const getUserInfo = async (
  authToken: string,
): Promise<MyInfo | undefined> => {
  const response = await fetch(UserAPIURL + '/auth/me', {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

  if (response?.ok) {
    const myJson = await response.json();
    return myJson;
  } else {
    return undefined;
  }
};

export const isVerified = async (authToken: string) => {
  const response = await fetch(UserAPIURL + '/auth/isVerified', {
    method: 'GET',
    headers: {
      'X-Xano-Authorization': `Bearer ${authToken}`,
      'X-Xano-Authorization-Only': 'true',
    },
  });

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

  const request = async (authtoken: string) => {
    const response = await fetch(UserAPIURL + '/firebase/updateToken', {
      method: 'POST',
      body: JSON.stringify({token: fcm_token}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  const response = await requestAndValidate(authToken, request);

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

  const request = async (authtoken: string) => {
    const response = await fetch(UserAPIURL + '/auth/uploadImage', {
      method: 'POST',
      body: JSON.stringify({content: 'data:image/png;base64,' + base64}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  const response = await requestAndValidate(authToken, request);

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

  const request = async (authtoken: string) => {
    const response = await fetch(UserAPIURL + '/auth/editInfo', {
      method: 'POST',
      body: JSON.stringify({first_name, last_name, username, age, gender}),
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  const response = await requestAndValidate(authToken, request);

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

  const request = async (authtoken: string) => {
    const response = await fetch(UserAPIURL + '/auth/removeAccount', {
      method: 'DELETE',
      headers: {
        'X-Xano-Authorization': `Bearer ${authtoken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

    return response;
  };

  const response = await requestAndValidate(authToken, request);

  return response.ok;
};

/**
 * @requires user_id should be set in EncryptedStorage before calling this function.
 * USER MUST BE LOGGED IN TO USE THIS.
 */
export const refreshAuthtoken = async (): Promise<string | null> => {
  const user_id = await EncryptedStorage.getItem('user_id');

  if (!user_id) {
    throw new Error('user_id not found in EncryptedStorage');
  }

  const response = await fetch(UserAPIURL + '/auth/refreshAuthtoken', {
    method: 'POST',
    body: JSON.stringify({user_id}),
    headers: {
      'Content-Type': 'application/json',
      Authorization: XanoAPIKey,
    },
  });

  if (response.ok) {
    const myJson: {authtoken: string} = await response.json();
    return myJson.authtoken;
  } else {
    return null;
  }
};

export const requestAndValidate = async (
  authToken: string,
  request: (authtoken: string) => Promise<Response>,
): Promise<Response> => {
  const response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      await EncryptedStorage.setItem('auth_token', refreshedAuthtoken);
      const updatedResponse = await request(refreshedAuthtoken);
      return updatedResponse;
    } else {
      console.warn('Request to refresh authtoken failed.');
      return response;
    }
  } else {
    return response;
  }
};
