import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import UserIcon from '../../components/UserIcon';

import {Event, EventDetail, UserInfo} from '../../../utils/types';

interface Props {
  navigation: any;
  event: Event;
  eventDetail: EventDetail;
}

const Members: React.FC<Props> = ({navigation, event, eventDetail}) => {
  return (
    <View style={styles.container}>
      {eventDetail.members.map((member: UserInfo) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('User', {user: member})}
          key={member.id}
          style={[styles.user, styles.border]}>
          <View style={styles.profilePic}>
            <UserIcon user={member} />
          </View>
          <View style={STYLES.texts}>
            <Text
              size="s"
              numberOfLines={
                1
              }>{`${member.first_name} ${member.last_name}`}</Text>
            <Text
              size="xs"
              weight="l"
              color={colors.darkgrey}
              numberOfLines={1}>
              {'@' + member.username}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.user}
        onPress={() => {
          navigation.navigate('AddFriend', {
            members: eventDetail.members,
            event_id: event.id,
          });
        }}>
        <View style={styles.profilePic}>
          <Image style={[styles.pic, styles.add]} source={icons.add} />
        </View>
        <View style={STYLES.texts}>
          <Text>{strings.event.inviteAFriend}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: s(40),
    marginVertical: s(20),
    paddingHorizontal: s(15),
    paddingVertical: s(5),
    borderWidth: 1,
    borderRadius: s(20),
    borderColor: colors.grey,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: s(10),
  },
  profilePic: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(35),
    height: s(35),
    borderRadius: s(17.5),
    overflow: 'hidden',
  },
  pic: {
    width: '100%',
    height: '100%',
  },
  add: {
    width: '70%',
    height: '70%',
    tintColor: colors.accent,
  },
  border: {
    borderBottomWidth: 0.5,
    borderColor: colors.lightgrey,
  },
});

export default Members;