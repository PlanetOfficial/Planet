import {Alert} from 'react-native';
import strings from '../../../constants/strings';

import {UserInfo} from '../../../utils/types';
import {
  acceptFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  postFriendRequest,
  rejectFriendRequest,
} from '../../../utils/api/friendsAPI';

export const handleFriendRequest = async (
  userId: number,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  user: UserInfo,
) => {
  const response = await postFriendRequest(userId);

  if (response) {
    const requestsSentUpdated = [user, ...requestsSent];
    requestsSentUpdated;
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.friendRequest);
  }
};

export const handleUnfriend = async (
  userId: number,
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
) => {
  const response = await deleteFriend(userId);

  if (response) {
    const friendsUpdated = friends.filter(
      (friend: UserInfo) => friend.id !== userId,
    );
    setFriends(friendsUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.unfriend);
  }
};

export const handleAcceptRequest = async (
  userId: number,
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
  user: UserInfo,
) => {
  const response = await acceptFriendRequest(userId);

  if (response) {
    const friendsUpdated = [user, ...friends];
    setFriends(friendsUpdated);

    const requestsUpdated = requests.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequests(requestsUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.acceptFriendRequest);
  }
};

export const handleDeclineRequest = async (
  userId: number,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
) => {
  const response = await rejectFriendRequest(userId);

  if (response) {
    const requestsUpdated = requests.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequests(requestsUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.declineFriendRequest);
  }
};

export const handleCancelRequest = async (
  userId: number,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
) => {
  const response = await deleteFriendRequest(userId);

  if (response) {
    const requestsSentUpdated = requestsSent.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.cancelFriendRequest);
  }
};
