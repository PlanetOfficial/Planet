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
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const response = await postFriendRequest(userId);

  if (response) {
    const requestsSentUpdated = [user, ...requestsSent];
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.friendRequest);
  }
  setLoading(false);
};

export const handleUnfriend = async (
  userId: number,
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const response = await deleteFriend(userId);

  if (response) {
    const friendsUpdated = friends.filter(
      (friend: UserInfo) => friend.id !== userId,
    );
    setFriends(friendsUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.unfriend);
  }
  setLoading(false);
};

export const handleAcceptRequest = async (
  userId: number,
  friends: UserInfo[],
  setFriends: (friends: UserInfo[]) => void,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
  user: UserInfo,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
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
  setLoading(false);
};

export const handleDeclineRequest = async (
  userId: number,
  requests: UserInfo[],
  setRequests: (requests: UserInfo[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const response = await rejectFriendRequest(userId);

  if (response) {
    const requestsUpdated = requests.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequests(requestsUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.declineFriendRequest);
  }
  setLoading(false);
};

export const handleCancelRequest = async (
  userId: number,
  requestsSent: UserInfo[],
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const response = await deleteFriendRequest(userId);

  if (response) {
    const requestsSentUpdated = requestsSent.filter(
      (request: UserInfo) => request.id !== userId,
    );
    setRequestsSent(requestsSentUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.cancelFriendRequest);
  }
  setLoading(false);
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
  setLoading?: (loading: boolean) => void,
) => {
  setLoading ? setLoading(true) : null;
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
  setLoading ? setLoading(false) : null;
};

export const handleUnblock = async (
  userId: number,
  usersIBlock: UserInfo[],
  setUsersIBlock: (usersBlockingMe: UserInfo[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  setLoading(true);
  const response = await unBlockFriend(userId);

  if (response) {
    const usersIBlockUpdated = usersIBlock.filter(
      (userIBlock: UserInfo) => userIBlock.id !== userId,
    );
    setUsersIBlock(usersIBlockUpdated);
  } else {
    Alert.alert(strings.error.error, strings.error.unblock);
  }
  setLoading(false);
};

export const handleReport = async (userId: number) => {
  const response = await reportUser(userId);

  if (response) {
    Alert.alert(strings.friends.reportUser, strings.friends.reportSuccess);
  } else {
    Alert.alert(strings.error.error, strings.error.reportUser);
  }
};
