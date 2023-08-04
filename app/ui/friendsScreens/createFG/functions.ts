import {Alert} from 'react-native';

import strings from '../../../constants/strings';

import {UserInfo} from '../../../utils/types';
import {searchUsers} from '../../../utils/api/friendsAPI';
import {postFG} from '../../../utils/api/fgAPI';
import {useFriendsContext} from '../../../context/FriendsContext';

export const search = async (
  text: string,
  setLoading: (loading: boolean) => void,
  setSearchText: (text: string) => void,
  setSearchResults: (results: UserInfo[]) => void,
  friends: UserInfo[],
) => {
  setLoading(true);
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
  setLoading(false);
};

export const createFG = async (
  name: string,
  selectedId: number[],
  navigation: any,
) => {
  if (name.length === 0) {
    Alert.alert(strings.error.error, strings.error.fgNameEmpty);
    return;
  }
  const response = await postFG(selectedId, name);

  if (response) {
    const {refreshFriends} = useFriendsContext();
    await refreshFriends();
    navigation.goBack();
  } else {
    Alert.alert(strings.error.error, strings.error.createFG);
  }
};
