import {Alert} from 'react-native';

import strings from '../../../constants/strings';

import {searchUsers} from '../../../utils/api/friendsAPI';
import {UserInfo} from '../../../utils/types';

export const search = async (
  text: string,
  setLoading: (loading: boolean) => void,
  setSearchText: (text: string) => void,
  setSearchResults: (results: UserInfo[]) => void,
  selfUserId: number,
  usersBlockingMe: UserInfo[],
) => {
  setLoading(true);
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
  setLoading(false);
};
