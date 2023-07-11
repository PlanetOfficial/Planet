import EncryptedStorage from 'react-native-encrypted-storage';
import {UserAPIURL} from './APIConstants';
import {NotificationSettings} from '../types';

/**
 * @requires auth_token should be set in EncryptedStorage before calling this function
 */
export const getNotificationSettings =
  async (): Promise<NotificationSettings | null> => {
    const authToken = await EncryptedStorage.getItem('auth_token');

    if (!authToken) {
      return null;
    }

    const response = await fetch(UserAPIURL + '/notifications/settings', {
      method: 'GET',
      headers: {
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    });

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

  const response = await fetch(
    UserAPIURL + '/notifications/notify_friend_request',
    {
      method: 'POST',
      headers: {
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

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

  const response = await fetch(
    UserAPIURL + '/notifications/notify_friend_request_accept',
    {
      method: 'POST',
      headers: {
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

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

  const response = await fetch(
    UserAPIURL + '/notifications/notify_event_invite',
    {
      method: 'POST',
      headers: {
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

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

  const response = await fetch(
    UserAPIURL + '/notifications/notify_new_suggestion',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

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

  const response = await fetch(
    UserAPIURL + '/notifications/notify_set_primary',
    {
      method: 'POST',
      headers: {
        'X-Xano-Authorization': `Bearer ${authToken}`,
        'X-Xano-Authorization-Only': 'true',
      },
    },
  );

  return response.ok;
};
