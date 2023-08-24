import React from 'react';
import {View, SectionList, Keyboard, useColorScheme} from 'react-native';

import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import {UserInfo} from '../../../utils/types';

interface Props {
  searchResults: UserInfo[];
  friends: UserInfo[];
  searchText: string;
  renderItem: ({item}: {item: UserInfo}) => JSX.Element;
}

const SearchResult: React.FC<Props> = ({
  searchResults,
  friends,
  searchText,
  renderItem,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return (
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
      renderItem={renderItem}
      renderSectionHeader={({section}) =>
        section.data.length > 0 ? (
          <View style={STYLES.sectionHeader}>
            <Text size="s" weight="l">
              {section.title}
            </Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        searchText.length > 0 ? (
          <View style={STYLES.center}>
            <Text weight="l">{strings.error.noResultsFound}</Text>
          </View>
        ) : null
      }
      keyExtractor={user => user.id.toString()}
    />
  );
};

export default SearchResult;
