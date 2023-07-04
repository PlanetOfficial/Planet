import React, {createRef, useContext, useState} from 'react';
import {
  View,
  FlatList,
  Alert,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
  LayoutAnimation,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity as TO,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';
import prompt from 'react-native-prompt-android';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';
import {getFriends, searchUsers} from '../../../utils/api/friendsAPI';
import {postFG} from '../../../utils/api/fgAPI';

const CreateFG = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends, setFriendGroups} = friendsContext;

  const [selectedId, setSelectedId] = useState<number[]>([]);

  const searchRef = createRef<TextInput>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const search = async (text: string) => {
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

  const loadFriends = async () => {
    const response = await getFriends();

    if (response) {
      setFriendGroups(response.friendgroups);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  const createFG = async (name: string) => {
    const response = await postFG(selectedId, name);

    if (response) {
      loadFriends();
      navigation.goBack();
    } else {
      Alert.alert(strings.error.error, strings.error.createFG);
    }
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            icon={icons.close}
            onPress={() => {
              if (selectedId.length > 0) {
                Alert.alert(
                  strings.main.warning,
                  strings.friends.fgCreateBackConfirmation,
                  [
                    {
                      text: strings.main.cancel,
                      style: 'cancel',
                    },
                    {
                      text: strings.main.discard,
                      onPress: () => navigation.goBack(),
                      style: 'destructive',
                    },
                  ],
                );
              } else {
                navigation.goBack();
              }
            }}
          />
          <View style={[styles.searchBar, STYLES.shadow]}>
            <Icon size="s" icon={icons.search} />
            <TextInput
              ref={searchRef}
              style={styles.searchText}
              value={searchText}
              placeholder={strings.search.searchFriends}
              placeholderTextColor={colors[theme].neutral}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                setSearching(true);
              }}
              onBlur={() => setSearching(false)}
              onChangeText={text => search(text)}
              clearButtonMode="while-editing"
            />
          </View>
          {searching ? (
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => {
                searchRef.current?.blur();
                searchRef.current?.clear();
                setSearching(false);
                setSearchText('');
                setSearchResults([]);
              }}>
              <Text>{strings.main.cancel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
      {searching ? (
        loading ? (
          <View style={[STYLES.center, STYLES.container]}>
            <ActivityIndicator size="small" color={colors[theme].accent} />
          </View>
        ) : (
          <FlatList
            style={STYLES.container}
            contentContainerStyle={STYLES.flatList}
            data={searchResults}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}: {item: UserInfo}) => (
              <TouchableOpacity
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
        )
      ) : (
        <FlatList
          style={STYLES.container}
          contentContainerStyle={STYLES.flatList}
          data={friends}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}: {item: UserInfo}) => (
            <TouchableOpacity
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
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={STYLES.center}>
              <Text>{strings.friends.noFriendsFound}</Text>
            </View>
          }
        />
      )}
      <TO
        style={[
          STYLES.button,
          {
            backgroundColor:
              selectedId.length === 0
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        disabled={selectedId.length === 0}
        onPress={() =>
          prompt(strings.main.rename, strings.event.renamePrompt, [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Save',
              onPress: name => {
                createFG(name);
              },
            },
          ])
        }>
        <Text color={colors[theme].primary}>
          {strings.event.create +
            (selectedId.length > 0 ? ` (${selectedId.length})` : '')}
        </Text>
      </TO>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors[theme].primary,
      borderRadius: s(10),
      marginLeft: s(10),
      paddingHorizontal: s(10),
      paddingVertical: s(5),
    },
    searchText: {
      flex: 1,
      marginLeft: s(10),
      fontSize: s(13),
      fontFamily: 'Lato',
      padding: 0,
      color: colors[theme].neutral,
    },
    cancel: {
      marginLeft: s(10),
    },
  });

export default CreateFG;
