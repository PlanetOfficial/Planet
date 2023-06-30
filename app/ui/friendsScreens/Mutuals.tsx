import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

import {UserInfo} from '../../utils/types';
import Separator from '../components/Separator';
import UserIcon from '../components/UserIcon';

/*
 * route params:
 * - mutuals: UserInfo[]
 */
const Mutuals = ({navigation, route}: {navigation: any; route: any}) => {
  const [mutuals] = useState<UserInfo[]>(route.params.mutuals);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon icon={icons.close} onPress={() => navigation.goBack()} />
          <Text>{strings.friends.mutualFriends}</Text>
          <Icon
            size="m"
            icon={icons.question}
            onPress={() =>
              Alert.alert(
                strings.friends.mutualFriends,
                strings.friends.mutualFriendsDescriptions,
              )
            }
          />
        </View>
      </SafeAreaView>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.flatList}
        data={mutuals}
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
          <View style={styles.center}>
            <Text>{strings.friends.noFriendsFound}</Text>
            <Text> </Text>
            <Text size="s" color={colors.darkgrey}>
              {strings.friends.noFriendsFoundDescription}
            </Text>
          </View>
        }
        ItemSeparatorComponent={Separator}
      />
    </View>
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
});

export default Mutuals;
