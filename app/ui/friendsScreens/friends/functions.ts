import {Alert, LayoutAnimation} from 'react-native';

import strings from '../../../constants/strings';

import {FriendGroup, UserInfo} from '../../../utils/types';
import {deleteFG, editFG} from '../../../utils/api/fgAPI';
import {getFriendsInfo, searchUsers} from '../../../utils/api/friendsAPI';

export const search = async (
  text: string,
  setSearchText: (text: string) => void,
  setSearchResults: (results: UserInfo[]) => void,
  selfUserId: number,
  usersBlockingMe: UserInfo[],
) => {
  setSearchText(text);
  if (text.length > 0) {
    const result = await searchUsers(text);

    if (result) {
      // exclude current user (and users you are blocked by) from search results
      const filtered = result.filter(
        user =>
          user.id !== selfUserId &&
          !usersBlockingMe.some(b => b.id === user.id),
      ) as UserInfo[];
      setSearchResults(filtered);
    } else {
      Alert.alert(strings.error.error, strings.error.searchError);
    }
  }
};

export const beginFGEditing = (
  friendGroups: FriendGroup[],
  setFgEditing: (fgEditing: boolean) => void,
  setTempName: (tempName: string | undefined) => void,
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void,
  fgSelected: number,
) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setTempName(friendGroups.find(fg => fg.id === fgSelected)?.name || '');
  setTempMembers(friendGroups.find(fg => fg.id === fgSelected)?.members || []);
  setFgEditing(true);
};

export const resetFGEditing = (
  setFgEditing: (fgEditing: boolean) => void,
  setTempName: (tempName: string | undefined) => void,
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void,
) => {
  setFgEditing(false);
  setTempName(undefined);
  setTempMembers(undefined);
};

export const saveFGEditing = async (
  fgSelected: number,
  tempName: string | undefined,
  tempMembers: UserInfo[] | undefined,
  setFgEditing: (fgEditing: boolean) => void,
  setFriends: (friends: UserInfo[]) => void,
  setFriendGroups: (friendGroups: FriendGroup[]) => void,
  setUsersIBlock: (usersIBlock: UserInfo[]) => void,
  setUsersBlockingMe: (usersBlockingMe: UserInfo[]) => void,
  setRequests: (requests: UserInfo[]) => void,
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  setSuggestions: (suggestions: UserInfo[]) => void,
) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  if (!tempMembers || !tempName) {
    return;
  }

  const response = await editFG(
    fgSelected,
    tempMembers.map(user => user.id),
    tempName,
  );

  if (response) {
    setFgEditing(false);
    loadFriends(
      setFriends,
      setFriendGroups,
      setUsersIBlock,
      setUsersBlockingMe,
      setRequests,
      setRequestsSent,
      setSuggestions,
    );
  } else {
    Alert.alert(strings.error.error, strings.error.editFGName);
  }
};

export const handleRemoveFG = async (
  fgSelected: number,
  setFgSelected: (fgSelected: number) => void,
  setFgEditing: (fgEditing: boolean) => void,
  setTempName: (tempName: string | undefined) => void,
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void,
  setFriends: (friends: UserInfo[]) => void,
  setFriendGroups: (friendGroups: FriendGroup[]) => void,
  setUsersIBlock: (usersIBlock: UserInfo[]) => void,
  setUsersBlockingMe: (usersBlockingMe: UserInfo[]) => void,
  setRequests: (requests: UserInfo[]) => void,
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  setSuggestions: (suggestions: UserInfo[]) => void,
) => {
  const response = await deleteFG(fgSelected);

  if (response) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFgSelected(0);
    resetFGEditing(setFgEditing, setTempName, setTempMembers);
    loadFriends(
      setFriends,
      setFriendGroups,
      setUsersIBlock,
      setUsersBlockingMe,
      setRequests,
      setRequestsSent,
      setSuggestions,
    );
  } else {
    Alert.alert(strings.error.error, strings.error.deleteFG);
  }
};

const loadFriends = async (
  setFriends: (friends: UserInfo[]) => void,
  setFriendGroups: (friendGroups: FriendGroup[]) => void,
  setUsersIBlock: (usersIBlock: UserInfo[]) => void,
  setUsersBlockingMe: (usersBlockingMe: UserInfo[]) => void,
  setRequests: (requests: UserInfo[]) => void,
  setRequestsSent: (requestsSent: UserInfo[]) => void,
  setSuggestions: (suggestions: UserInfo[]) => void,
) => {
  const response = await getFriendsInfo();

  if (response) {
    setFriends(response.friends);
    setFriendGroups(response.friend_groups);
    setUsersIBlock(response.usersIBlock);
    setUsersBlockingMe(response.usersBlockingMe);
    setRequests(response.requests);
    setRequestsSent(response.requests_sent);
    setSuggestions(response.suggestions);
  } else {
    Alert.alert(strings.error.error, strings.error.loadFriendsList);
  }
};
