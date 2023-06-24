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
import FriendsNavBar from '../navigation/FriendsNavBar';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Icon from '../components/Icon';
import Separator from '../components/Separator';
import UserIcon from '../components/UserIcon';
import Text from '../components/Text';

import {searchUsers} from '../../utils/api/friendsAPI';
import {UserInfo} from '../../utils/types';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={[localStyles.searchBar, styles.shadow]}>
            <Icon size="s" icon={icons.search} color={colors.darkgrey} />
            <TextInput
              ref={searchRef}
              style={localStyles.searchText}
              placeholder={strings.search.search}
              placeholderTextColor={colors.grey}
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
              style={localStyles.cancel}
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
          <View style={[styles.center, styles.container]}>
            <ActivityIndicator size="small" color={colors.accent} />
          </View>
        ) : (
          <FlatList
            style={styles.container}
            contentContainerStyle={styles.flatList}
            data={searchResult}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}: {item: UserInfo}) => (
              <TouchableOpacity
                style={userStyles.container}
                onPress={() =>
                  navigation.navigate('User', {
                    user: item,
                  })
                }>
                <View style={userStyles.profilePic}>
                  <UserIcon user={item} />
                </View>
                <View style={userStyles.texts}>
                  <Text
                    size="s"
                    numberOfLines={
                      1
                    }>{`${item.first_name} ${item.last_name}`}</Text>
                  <Text
                    size="s"
                    weight="l"
                    color={colors.darkgrey}
                    numberOfLines={1}>
                    {'@' + item.username}
                  </Text>
                </View>
                <Icon icon={icons.next} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchText.length > 0 ? (
                <View style={styles.center}>
                  <Text>{strings.search.noResultsFound}</Text>
                </View>
              ) : null
            }
            ItemSeparatorComponent={Separator}
          />
        )
      ) : (
        <FriendsNavBar />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
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
  },
  cancel: {
    marginLeft: s(10),
  },
});

const userStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(20),
    paddingVertical: s(10),
  },
  profilePic: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(45),
    height: s(45),
    borderRadius: s(22.5),
    overflow: 'hidden',
  },
  texts: {
    flex: 1,
    height: s(50),
    justifyContent: 'space-evenly',
    marginHorizontal: s(10),
  },
});

export default Friends;
