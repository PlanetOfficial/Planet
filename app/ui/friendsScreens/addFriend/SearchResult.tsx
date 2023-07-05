import React from 'react';
import {View, FlatList, ActivityIndicator, useColorScheme} from 'react-native';
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
  searchResults: UserInfo[];
  invitees: UserInfo[];
  setInvitees: (invitees: UserInfo[]) => void;
  searchText: string;
  loading: boolean;
}

const SearchResult: React.FC<Props> = ({
  searchResults,
  invitees,
  setInvitees,
  searchText,
  loading,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return loading ? (
    <View style={[STYLES.center, STYLES.container]}>
      <ActivityIndicator size="small" color={colors[theme].accent} />
    </View>
  ) : (
    <FlatList
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      data={searchResults}
      keyboardShouldPersistTaps="always"
      keyExtractor={item => item.id.toString()}
      renderItem={({item}: {item: UserInfo}) => (
        <TouchableOpacity
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
              color={colors[theme].accent}
              icon={
                invitees?.find(user => user.id === item.id)
                  ? icons.selected
                  : icons.unselected
              }
            />
          </UserRow>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        searchText.length > 0 ? (
          <View style={STYLES.center}>
            <Text>{strings.search.noResultsFound}</Text>
          </View>
        ) : null
      }
    />
  );
};

export default SearchResult;
