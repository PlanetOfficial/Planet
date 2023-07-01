import React, {useContext} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  useColorScheme,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';
import {getFriends} from '../../../utils/api/friendsAPI';

const FriendsList = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends, setFriends, setFriendGroups} = friendsContext;

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

  return (
    <FlatList
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      data={friends}
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
        <View style={STYLES.center}>
          <Text>{strings.friends.noFriendsFound}</Text>
          <Text> </Text>
          <Text size="s">{strings.friends.noFriendsFoundDescription}</Text>
        </View>
      }
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
      }
    />
  );
};

export default FriendsList;
