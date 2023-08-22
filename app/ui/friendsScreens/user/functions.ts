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
import {blockFriend, unBlockFriend} from '../../../utils/api/fgAPI';
import {reportUser} from '../../../utils/api/authAPI';

export const handleFriendRequest = async (
  userId: number,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  user: UserInfo,
) => {
  const response = await postFriendRequest(userId);

  if (response) {
    const requestsSentUpdated = [user, ...requestsSent];
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
  suggestions: UserInfo[],
  setSuggestions: (suggestions: UserInfo[]) => void,
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

    const suggestionsUpdated = suggestions.filter(
      (suggestion: UserInfo) => suggestion.id !== userId,
    );
    setSuggestions(suggestionsUpdated);
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

export const handleBlock = async (
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  usersIBlock: UserInfo[],
  setUsersIBlock: (usersIBlock: UserInfo[]) => void,
  user: UserInfo,
) => {
  const response = await blockFriend(user.id);

  if (response) {
    const usersIBlockUpdated = [user, ...usersIBlock];
    setUsersIBlock(usersIBlockUpdated);

    const friendsUpdated = friends.filter(
      (friend: UserInfo) => friend.id !== user.id,
    );
    setFriends(friendsUpdated);

    const requestsUpdated = requests.filter(
      (request: UserInfo) => request.id !== user.id,
    );
    setRequests(requestsUpdated);

    const requestsSentUpdated = requestsSent.filter(
      (request: UserInfo) => request.id !== user.id,
    );
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.block);
  }
};

export const handleUnblock = async (
  userId: number,
  usersIBlock: UserInfo[],
  setUsersIBlock: (usersBlockingMe: UserInfo[]) => void,
) => {
  const response = await unBlockFriend(userId);

  if (response) {
    const usersIBlockUpdated = usersIBlock.filter(
      (userIBlock: UserInfo) => userIBlock.id !== userId,
    );
    setUsersIBlock(usersIBlockUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.unblock);
  }
};

export const handleReport = async (userId: number) => {
  const response = await reportUser(userId);

  if (response) {
    Alert.alert(strings.friends.reportUser, strings.friends.reportSuccess);
  } else {
    Alert.alert(strings.error.error, strings.error.reportUser);
  }
};
