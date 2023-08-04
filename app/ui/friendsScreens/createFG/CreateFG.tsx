import React, {useContext, useState} from 'react';
import {
  View,
  FlatList,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {TouchableOpacity as TouchableOpacityGestureHandler} from 'react-native-gesture-handler';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import {UserInfo} from '../../../utils/types';

import Header from './Header';
import Button from './Button';
import { useFriendsContext } from '../../../context/FriendsContext';

const CreateFG = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {friends} = useFriendsContext();

  const [selectedId, setSelectedId] = useState<number[]>([]);

  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View style={STYLES.container}>
      <Header
        navigation={navigation}
        selectedId={selectedId}
        setLoading={setLoading}
        searchText={searchText}
        setSearchText={setSearchText}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        searching={searching}
        setSearching={setSearching}
        friends={friends}
      />

      {searching ? (
        loading ? (
          <View style={[STYLES.center, STYLES.container]}>
            <ActivityIndicator size="small" color={colors[theme].accent} />
          </View>
        ) : (
          <FlatList
            style={STYLES.container}
            contentContainerStyle={STYLES.flatList}
            scrollIndicatorInsets={{right: 1}}
            data={searchResults}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}: {item: UserInfo}) => (
              <TouchableOpacityGestureHandler
                onPress={() => {
                  setSearchText('');

                  if (selectedId.includes(item.id)) {
                    setSelectedId(selectedId.filter(id => id !== item.id));
                  } else {
                    setSelectedId([...selectedId, item.id]);
                  }
                }}>
                <UserRow user={item}>
                  <Icon
                    size="m"
                    icon={
                      selectedId.includes(item.id)
                        ? icons.selected
                        : icons.unselected
                    }
                    color={colors[theme].accent}
                  />
                </UserRow>
              </TouchableOpacityGestureHandler>
            )}
            ListEmptyComponent={
              searchText.length > 0 ? (
                <View style={STYLES.center}>
                  <Text>{strings.search.noResultsFound}</Text>
                </View>
              ) : null
            }
          />
        )
      ) : (
        <FlatList
          style={STYLES.container}
          contentContainerStyle={STYLES.flatList}
          scrollIndicatorInsets={{right: 1}}
          data={friends}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}: {item: UserInfo}) => (
            <TouchableOpacityGestureHandler
              onPress={() => {
                if (selectedId.includes(item.id)) {
                  setSelectedId(selectedId.filter(id => id !== item.id));
                } else {
                  setSelectedId([...selectedId, item.id]);
                }
              }}>
              <UserRow user={item}>
                <Icon
                  size="m"
                  icon={
                    selectedId.includes(item.id)
                      ? icons.selected
                      : icons.unselected
                  }
                  color={colors[theme].accent}
                />
              </UserRow>
            </TouchableOpacityGestureHandler>
          )}
          ListEmptyComponent={
            <View style={STYLES.center}>
              <Text>{strings.friends.noFriendsFound}</Text>
            </View>
          }
        />
      )}

      <Button
        navigation={navigation}
        selectedId={selectedId}
      />
    </View>
  );
};

export default CreateFG;
