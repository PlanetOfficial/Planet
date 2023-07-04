import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  RefreshControl,
  useColorScheme,
  StatusBar,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';
import {getFriends} from '../../../utils/api/friendsAPI';
import Separator from '../../components/Separator';

const FriendsList = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends, setFriends, friendGroups, setFriendGroups} = friendsContext;

  const [loading, setLoading] = React.useState(false);
  const loadFriends = async () => {
    const response = await getFriends();

    if (response) {
      setFriends(response.friends);
      setFriendGroups(response.friendgroups);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  const [fgSelected, setFgSelected] = React.useState(0);

  return (
    <ScrollView
      style={STYLES.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={async () => {
            setLoading(true);
            await loadFriends();
            setLoading(false);
          }}
          tintColor={colors[theme].accent}
        />
      }>
      {friendGroups.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.friendGroups}>
          {friendGroups.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (fgSelected === item.id) {
                  setFgSelected(0);
                } else {
                  setFgSelected(item.id);
                }
              }}
              style={styles.friendGroup}>
              <Text>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          style={[styles.add, STYLES.shadow]}
          onPress={() => {
            navigation.navigate('CreateFG');
          }}>
          <Icon size="m" icon={icons.add} color={colors[theme].accent} />
          <View style={styles.addText}>
            <Text size="s" color={colors[theme].accent}>
              {strings.friends.createFriendGroup}
            </Text>
          </View>
        </TouchableOpacity>
      )}
      <Separator />
      {friends.map((item: UserInfo) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            navigation.push('User', {
              user: item,
            })
          }>
          <UserRow user={item}>
            <Icon size="xs" icon={icons.next} />
          </UserRow>
        </TouchableOpacity>
      ))}
      {friends.length === 0 ? (
        <View style={STYLES.center}>
          <Text>{strings.friends.noFriendsFound}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    friendGroups: {
      flexDirection: 'row',
    },
    friendGroup: {
      padding: s(10),
      margin: s(10),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
    add: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: s(20),
      paddingHorizontal: s(20),
      paddingVertical: s(10),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
    addText: {
      marginLeft: s(10),
    },
  });

export default FriendsList;
