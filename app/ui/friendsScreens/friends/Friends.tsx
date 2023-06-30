import React, {useState, createRef} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {TouchableOpacity} from 'react-native-gesture-handler';

import FriendsNavBar from '../../navigations/FriendsNavBar';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {searchUsers} from '../../../utils/api/friendsAPI';
import {UserInfo} from '../../../utils/types';
import UserRow from '../../components/UserRow';

const Friends = ({navigation}: {navigation: any}) => {
  const searchRef = createRef<TextInput>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchResult, setSearchResult] = useState<UserInfo[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const search = async (text: string) => {
    setLoading(true);
    setSearchText(text);
    if (text.length > 0) {
      const result = await searchUsers(text);

      if (result) {
        setSearchResult(result);
      } else {
        Alert.alert(strings.error.error, strings.error.searchError);
      }
    }
    setLoading(false);
  };

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={[styles.searchBar, STYLES.shadow]}>
            <Icon size="s" icon={icons.search} color={colors.black} />
            <TextInput
              ref={searchRef}
              style={styles.searchText}
              placeholder={strings.search.search}
              placeholderTextColor={colors.black}
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
            />
          </View>
          {searching ? (
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => {
                searchRef.current?.clear();
                setSearching(false);
                setSearchResult([]);
              }}>
              <Text>{strings.main.cancel}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </SafeAreaView>
      {searching ? (
        loading ? (
          <View style={[STYLES.center, STYLES.container]}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            style={STYLES.container}
            contentContainerStyle={STYLES.flatList}
            data={searchResult}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}: {item: UserInfo}) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.push('User', {
                    user: item,
                  })
                }>
                <UserRow user={item}>
                  <Icon size="xs" icon={icons.next} />
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
        <FriendsNavBar />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
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
  },
  cancel: {
    marginLeft: s(10),
  },
});

export default Friends;
