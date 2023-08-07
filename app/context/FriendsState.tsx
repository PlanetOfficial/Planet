import React, {useState, useEffect, useMemo} from 'react';
import {Alert} from 'react-native';
import strings from '../constants/strings';
import FriendsContext from './FriendsContext';
import {getFriendsInfo} from '../utils/api/friendsAPI';
import {FriendGroup, UserInfo} from '../utils/types';

const FriendsStateProvider = ({
  children,
  isLoggedIn,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
}) => {
  const [suggestions, setSuggestions] = useState<UserInfo[]>([]);
  const [friends, setFriends] = useState<UserInfo[]>([]);
  const [requests, setRequests] = useState<UserInfo[]>([]);
  const [requestsSent, setRequestsSent] = useState<UserInfo[]>([]);
  const [friendGroups, setFriendGroups] = useState<FriendGroup[]>([]);
  const [usersIBlock, setUsersIBlock] = useState<UserInfo[]>([]);
  const [usersBlockingMe, setUsersBlockingMe] = useState<UserInfo[]>([]);

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

  useEffect(() => {
    if (isLoggedIn) {
      initializeFriendsInfo();
    }
  }, [isLoggedIn]);

  return (
    <FriendsContext.Provider value={friendsContext}>
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsStateProvider;