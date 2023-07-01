import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  useColorScheme,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import UserIcon from '../../components/UserIcon';

import {Event, EventDetail, UserInfo} from '../../../utils/types';

interface Props {
  navigation: any;
  event: Event;
  eventDetail: EventDetail;
}

const Members: React.FC<Props> = ({navigation, event, eventDetail}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  return (
    <View style={styles.container}>
      {eventDetail.members.map((member: UserInfo) => (
        <TouchableOpacity
          onPress={() => navigation.push('User', {user: member})}
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
            <Text size="xs" weight="l" numberOfLines={1}>
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

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginHorizontal: s(40),
      marginVertical: s(20),
      paddingHorizontal: s(15),
      paddingVertical: s(5),
      borderWidth: 1,
      borderRadius: s(20),
      borderColor: colors[theme].secondary,
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
      tintColor: colors[theme].accent,
    },
    border: {
      borderBottomWidth: 1,
      borderColor: colors[theme].secondary,
    },
  });

export default Members;
