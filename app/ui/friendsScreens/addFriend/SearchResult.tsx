import React from 'react';
import {
  View,
  ActivityIndicator,
  useColorScheme,
  SectionList,
  Keyboard,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';
import UserRow from '../../components/UserRow';

import {UserInfo} from '../../../utils/types';

interface Props {
  searchText: string;
  searchResults: UserInfo[];
  friends: UserInfo[];
  members: UserInfo[];
  invitees: UserInfo[];
  setInvitees: (invitees: UserInfo[]) => void;
  loading: boolean;
}

const SearchResult: React.FC<Props> = ({
  searchText,
  searchResults,
  friends,
  members,
  invitees,
  setInvitees,
  loading,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return loading ? (
    <View style={[STYLES.center, STYLES.container]}>
      <ActivityIndicator size="small" color={colors[theme].accent} />
    </View>
  ) : (
    <SectionList
      sections={
        searchResults.length > 0
          ? [
              {
                title: strings.friends.friends,
                data: searchResults.filter(user =>
                  friends.some(friend => friend.id === user.id),
                ),
              },
              {
                title: strings.friends.users,
                data: searchResults.filter(
                  user => !friends.some(friend => friend.id === user.id),
                ),
              },
            ]
          : []
      }
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      initialNumToRender={10}
      onScrollBeginDrag={() => Keyboard.dismiss()}
      keyboardShouldPersistTaps={'always'}
      scrollIndicatorInsets={{right: 1}}
      data={searchResults}
      renderItem={({item}: {item: UserInfo}) => (
        <TouchableOpacity
          disabled={members.some(user => user.id === item.id)}
          onPress={() => {
            if (invitees?.find(user => user.id === item.id)) {
              setInvitees(invitees.filter(user => user.id !== item.id));
            } else {
              setInvitees([...(invitees || []), item]);
            }
          }}>
          <UserRow user={item}>
            <Icon
              size="m"
              color={
                members.some(user => user.id === item.id)
                  ? colors[theme].secondary
                  : colors[theme].accent
              }
              icon={
                members.concat(invitees)?.find(user => user.id === item.id)
                  ? icons.selected
                  : icons.unselected
              }
            />
          </UserRow>
        </TouchableOpacity>
      )}
      renderSectionHeader={({section}) =>
        section.data.length > 0 ? (
          <View style={STYLES.sectionHeader}>
            <Text size="s">{section.title}</Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        searchText.length > 0 ? (
          <View style={STYLES.center}>
            <Text>{strings.search.noResultsFound}</Text>
          </View>
        ) : null
      }
      keyExtractor={user => user.id.toString()}
    />
  );
};

export default SearchResult;
