import {Alert, useColorScheme} from 'react-native';
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
    const newRequestsSent = [...requestsSent, user];
    setRequestsSent(newRequestsSent);
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
    const newFriends = friends.filter(
      (friend: UserInfo) => friend.id !== userId,
    );
    setFriends(newFriends);
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

    const newFriends = [...friends, user];
    setFriends(newFriends);

    const newRequests = requests.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequests(newRequests);
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
    const newRequests = requests.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequests(newRequests);
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
    const newRequestsSent = requestsSent.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequestsSent(newRequestsSent);
  } else {
    Alert.alert(strings.error.error, strings.error.cancelFriendRequest);
  }
};
