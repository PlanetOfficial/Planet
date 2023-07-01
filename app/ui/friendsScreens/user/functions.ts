import {Alert} from 'react-native';
import strings from '../../../constants/strings';

import {UserInfo, UserStatus} from '../../../utils/types';
import {
  acceptFriendRequest,
  deleteFriend,
  deleteFriendRequest,
  postFriendRequest,
  rejectFriendRequest,
} from '../../../utils/api/friendsAPI';

export const handleFriendRequest = async (
  userId: number,
  setStatus: (status: UserStatus) => void,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  user: UserInfo,
) => {
  const response = await postFriendRequest(userId);

  if (response) {
    setStatus('REQSENT');
    const requestsSentUpdated = [user, ...requestsSent];
    requestsSentUpdated;
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.friendRequest);
  }
};

export const handleUnfriend = async (
  userId: number,
  setStatus: (status: UserStatus) => void,
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
) => {
  const response = await deleteFriend(userId);

  if (response) {
    setStatus('NONE');
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
  setStatus: (status: UserStatus) => void,
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
  user: UserInfo,
) => {
  const response = await acceptFriendRequest(userId);

  if (response) {
    setStatus('FRIENDS');

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
  setStatus: (status: UserStatus) => void,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
) => {
  const response = await rejectFriendRequest(userId);

  if (response) {
    setStatus('NONE');
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
  setStatus: (status: UserStatus) => void,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
) => {
  const response = await deleteFriendRequest(userId);

  if (response) {
    setStatus('NONE');
    const requestsSentUpdated = requestsSent.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.cancelFriendRequest);
  }
};
