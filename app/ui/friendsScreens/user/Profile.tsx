import React from 'react';
import {View, StyleSheet, TouchableOpacity, useColorScheme} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import UserIconXL from '../../components/UserIconXL';

import {UserInfo} from '../../../utils/types';
import ActionButtons from '../components/ActionButtons';

interface Props {
  navigation: any;
  user: UserInfo;
  mutuals: UserInfo[];
}

const Profile: React.FC<Props> = ({navigation, user, mutuals}) => {
  const theme = useColorScheme() || 'light';

  return (
    <View style={styles.container}>
      <View style={styles.profilePic}>
        <UserIconXL user={user} />
      </View>
      <View>
        <View style={styles.texts}>
          <Text size="l" numberOfLines={1}>
            {user.first_name} {user.last_name}
          </Text>
          <Text size="s" weight="l" numberOfLines={1}>
            @{user.username}
          </Text>
        </View>
        {mutuals.length > 0 ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Mutuals', {
                mutuals: mutuals,
              })
            }>
            <Text size="s" color={colors[theme].accent} numberOfLines={1}>
              {mutuals.length +
                ' ' +
                (mutuals.length === 1
                  ? strings.friends.mutualFriend
                  : strings.friends.mutualFriends)}
            </Text>
          </TouchableOpacity>
        ) : null}
        <View style={styles.buttons}>
          <ActionButtons user={user} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    marginVertical: s(20),
  },
  profilePic: {
    width: s(120),
    height: s(120),
    borderRadius: s(40),
    overflow: 'hidden',
    marginRight: s(20),
  },
  texts: {
    height: s(55),
    justifyContent: 'space-evenly',
    maxWidth: s(170),
    marginBottom: s(5),
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: s(10),
  },
});

export default Profile;
