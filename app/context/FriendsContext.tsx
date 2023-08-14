import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from 'react';
import {Alert} from 'react-native';

import strings from '../constants/strings';

import {getFriendsInfo} from '../utils/api/friendsAPI';
import {FriendGroup, UserInfo} from '../utils/types';

import {FriendsContextType} from './ContextTypes';

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

const FriendsStateProvider = ({
  children,
  isLoggedInStack,
}: {
  children: React.ReactNode;
  isLoggedInStack: boolean;
}) => {
  const [suggestions, setSuggestions] = useState<UserInfo[]>([]);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [requests, setRequests] = useState<UserInfo[]>([]);
  const [requestsSent, setRequestsSent] = useState<UserInfo[]>([]);
  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>([]);
  const [usersIBlock, setUsersIBlock] = useState<UserInfo[]>([]);
  const [usersBlockingMe, setUsersBlockingMe] = useState<UserInfo[]>([]);

  const initializeFriendsInfo = async () => {
    const result = await getFriendsInfo();
    if (result) {
      setSuggestions(result.suggestions);
      setFriends(result.friends);
      setRequests(result.requests);
      setRequestsSent(result.requests_sent);
      setFriendGroups(result.friend_groups);
      setUsersIBlock(result.usersIBlock);
      setUsersBlockingMe(result.usersBlockingMe);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  const refreshFriends = async () => {
    const result = await getFriendsInfo();
    if (result) {
      setFriends(result.friends);
      setFriendGroups(result.friend_groups);
      setUsersIBlock(result.usersIBlock);
      setUsersBlockingMe(result.usersBlockingMe);
      setRequests(result.requests);
      setRequestsSent(result.requests_sent);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  const friendsContext = useMemo(
    () => ({
      suggestions,
      setSuggestions,
      friends,
      setFriends,
      requests,
      setRequests,
      requestsSent,
      setRequestsSent,
      friendGroups,
      setFriendGroups,
      usersIBlock,
      setUsersIBlock,
      usersBlockingMe,
      setUsersBlockingMe,
      initializeFriendsInfo,
      refreshFriends,
    }),
    [
      suggestions,
      friends,
      requests,
      requestsSent,
      friendGroups,
      usersIBlock,
      usersBlockingMe,
    ],
  );

  useEffect(() => {
    if (isLoggedInStack) {
      initializeFriendsInfo();
    }
  }, [isLoggedInStack]);

  return (
    <FriendsContext.Provider value={friendsContext}>
      {children}
    </FriendsContext.Provider>
  );
};

const useFriendsContext = () => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('FriendsContext is not set!');
  }
  return context;
};

export {useFriendsContext, FriendsStateProvider};
