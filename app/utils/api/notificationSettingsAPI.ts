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

    const response = await fetch(
      UserAPIURL + `/notifications/settings?authtoken=${authToken}`,
      {
        method: 'GET',
      },
    );

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
    UserAPIURL + `/notifications/notify_friend_request?authtoken=${authToken}`,
    {
      method: 'POST',
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
    UserAPIURL +
      `/notifications/notify_friend_request_accept?authtoken=${authToken}`,
    {
      method: 'POST',
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
    UserAPIURL + `/notifications/notify_event_invite?authtoken=${authToken}`,
    {
      method: 'POST',
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
    UserAPIURL + `/notifications/notify_new_suggestion?authtoken=${authToken}`,
    {
      method: 'POST',
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
    UserAPIURL + `/notifications/notify_set_primary?authtoken=${authToken}`,
    {
      method: 'POST',
    },
  );

  return response.ok;
};
