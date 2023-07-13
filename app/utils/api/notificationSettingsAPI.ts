import EncryptedStorage from 'react-native-encrypted-storage';
import {UserAPIURL} from './APIConstants';
import {NotificationSettings} from '../types';
import {refreshAuthtoken} from './authAPI';
import {cacheAuthToken} from '../CacheHelpers';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getNotificationSettings =
  async (): Promise<NotificationSettings | null> => {
    const authToken = await EncryptedStorage.getItem('auth_token');

    if (!authToken) {
      return null;
    }

    const request = async (authtoken: string) => {
      const response = await fetch(UserAPIURL + '/notifications/settings', {
        method: 'GET',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      });

      return response;
    };

    let response = await request(authToken);

    if (response.status === 401) {
      const refreshedAuthtoken = await refreshAuthtoken();

      if (refreshedAuthtoken) {
        await cacheAuthToken(refreshedAuthtoken);
        response = await request(refreshedAuthtoken);
      }
    }

    if (response.ok) {
      const myJson: NotificationSettings = await response.json();
      return myJson;
    } else {
      return null;
    }
  };

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const toggleNotifyFriendRequest = async (): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      UserAPIURL + '/notifications/notify_friend_request',
      {
        method: 'POST',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      },
    );

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      await cacheAuthToken(refreshedAuthtoken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const toggleNotifyFriendRequestAccept = async (): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      UserAPIURL + '/notifications/notify_friend_request_accept',
      {
        method: 'POST',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      },
    );

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      await cacheAuthToken(refreshedAuthtoken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const toggleNotifyEventInvite = async (): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      UserAPIURL + '/notifications/notify_event_invite',
      {
        method: 'POST',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      },
    );

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      await cacheAuthToken(refreshedAuthtoken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const toggleNotifyNewSuggestion = async (): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      UserAPIURL + '/notifications/notify_new_suggestion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      },
    );

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      await cacheAuthToken(refreshedAuthtoken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const toggleNotifySetPrimary = async (): Promise<Boolean> => {
  const authToken = await EncryptedStorage.getItem('auth_token');

  if (!authToken) {
    return false;
  }

  const request = async (authtoken: string) => {
    const response = await fetch(
      UserAPIURL + '/notifications/notify_set_primary',
      {
        method: 'POST',
        headers: {
          'X-Xano-Authorization': `Bearer ${authtoken}`,
          'X-Xano-Authorization-Only': 'true',
        },
      },
    );

    return response;
  };

  let response = await request(authToken);

  if (response.status === 401) {
    const refreshedAuthtoken = await refreshAuthtoken();

    if (refreshedAuthtoken) {
      await cacheAuthToken(refreshedAuthtoken);
      response = await request(refreshedAuthtoken);
    }
  }

  return response.ok;
};
