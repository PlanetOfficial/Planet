import {Alert} from 'react-native';

import strings from '../../../constants/strings';

import {UserInfo} from '../../../utils/types';
import {
  acceptFriendRequest,
  deleteFriendRequest,
  rejectFriendRequest,
} from '../../../utils/api/friendsAPI';

export const handleAcceptRequest = async (
  user: UserInfo,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
) => {
  const response = await acceptFriendRequest(user.id);

  if (response) {
    const requestsUpdated = requests.filter(item => item.id !== user.id);
    setRequests(requestsUpdated);
    const friendsUpdated = [user, ...friends];
    setFriends(friendsUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.acceptFriendRequest);
  }
};

export const handleDeclineRequest = async (
  id: number,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
) => {
  const response = await rejectFriendRequest(id);

  if (response) {
    const requestsUpdated = requests.filter(item => item.id !== id);
    setRequests(requestsUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.declineFriendRequest);
  }
};

export const handleCancelRequest = async (
  id: number,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
) => {
  const response = await deleteFriendRequest(id);

  if (response) {
    const requestsSentUpdated = requestsSent.filter(item => item.id !== id);
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.cancelFriendRequest);
  }
};
