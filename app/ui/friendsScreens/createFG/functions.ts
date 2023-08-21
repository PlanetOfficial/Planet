import {Alert} from 'react-native';

import strings from '../../../constants/strings';

import {FriendGroup, UserInfo} from '../../../utils/types';
import {getFriendsInfo, searchUsers} from '../../../utils/api/friendsAPI';
import {postFG} from '../../../utils/api/fgAPI';

export const search = async (
  text: string,
  setSearchText: (text: string) => void,
  setSearchResults: (results: UserInfo[]) => void,
  friends: UserInfo[],
) => {
  setSearchText(text);
  if (text.length > 0) {
    let result = await searchUsers(text);

    if (result) {
      result = result.filter(user =>
        friends.some(friend => friend.id === user.id),
      );
      setSearchResults(result);
    } else {
      Alert.alert(strings.error.error, strings.error.searchError);
    }
  }
};

const loadFriends = async (
  setFriendGroups: (friendGroups: FriendGroup[]) => void,
) => {
  const response = await getFriendsInfo();

  if (response) {
    setFriendGroups(response.friend_groups);
  } else {
    Alert.alert(strings.error.error, strings.error.loadFriendsList);
  }
};

export const createFG = async (
  name: string,
  selectedIds: number[],
  setFriendGroups: (friendGroups: FriendGroup[]) => void,
  navigation: any,
) => {
  if (name.length === 0) {
    Alert.alert(strings.error.error, strings.error.fgNameEmpty);
    return;
  }
  const response = await postFG(selectedIds, name);

  if (response) {
    loadFriends(setFriendGroups);
    navigation.goBack();
  } else {
    Alert.alert(strings.error.error, strings.error.createFG);
  }
};
