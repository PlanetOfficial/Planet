import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserIcon from '../../components/UserIcon';
import Separator from '../../components/Separator';

import {UserInfo} from '../../../utils/types';
import {getSuggestions} from '../../../utils/api/friendsAPI';

// TODO: Refactor
const Friends = ({navigation}: {navigation: any}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshingFriends] = useState<boolean>(false);

  const [suggestions, setSuggestions] = useState<UserInfo[]>([]);

  const fetchSuggestions = async () => {
    const response = await getSuggestions();

    if (response) {
      setSuggestions(response);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
    setRefreshingFriends(false);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSuggestions();
    });

    return unsubscribe;
  }, [navigation]);

  return loading ? (
    <View style={[STYLES.center, STYLES.container]}>
      <ActivityIndicator size="small" color={colors.accent} />
    </View>
  ) : (
    <FlatList
      style={STYLES.container}
      data={suggestions}
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
              numberOfLines={1}>{`${item.first_name} ${item.last_name}`}</Text>
            <Text size="s" weight="l" color={colors.darkgrey} numberOfLines={1}>
              {'@' + item.username + '・'}
              <Text size="s" weight="l" color={colors.accent} numberOfLines={1}>
                {item.count + ' mutuals'}
              </Text>
            </Text>
          </View>
          <Icon icon={icons.next} />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={STYLES.center}>
          <Text>{strings.friends.noSuggestionsFound}</Text>
        </View>
      }
      ItemSeparatorComponent={Separator}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshingFriends(true);
            fetchSuggestions();
          }}
          tintColor={colors.accent}
        />
      }
    />
  );
};

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
  pic: {
    width: '100%',
    height: '100%',
  },
  texts: {
    flex: 1,
    height: s(50),
    justifyContent: 'space-evenly',
    marginHorizontal: s(10),
  },
  add: {
    width: '70%',
    height: '70%',
    tintColor: colors.accent,
  },
});

export default Friends;
