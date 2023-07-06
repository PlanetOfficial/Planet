import React from 'react';
import {
  View,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import UserIcon from '../../components/UserIcon';
import Icon from '../../components/Icon';

import {UserInfo} from '../../../utils/types';
import {onAdd} from './functions';

interface Props {
  navigation: any;
  isEvent: boolean;
  eventId?: number;
  invitees: UserInfo[];
  setInvitees: (invitees: UserInfo[]) => void;
}

const Footer: React.FC<Props> = ({
  navigation,
  isEvent,
  eventId,
  invitees,
  setInvitees,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  return (
    <SafeAreaView style={styles.footer}>
      <FlatList
        data={invitees}
        contentContainerStyle={styles.invitees}
        showsHorizontalScrollIndicator={false}
        horizontal
        keyExtractor={item => item.id.toString()}
        renderItem={({item}: {item: UserInfo}) => (
          <View style={styles.user}>
            <View style={styles.userIcon}>
              <UserIcon user={item} />
            </View>
            <View style={styles.name}>
              <Text size="xs" numberOfLines={1}>
                {item.first_name}
              </Text>
            </View>
            <View style={styles.checkmark}>
              <Icon
                size="m"
                icon={icons.minus}
                color={colors[theme].accent}
                onPress={() => {
                  const newInvitees = invitees.filter(
                    invitee => invitee.id !== item.id,
                  );
                  setInvitees(newInvitees);
                }}
              />
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor:
              isEvent && invitees.length === 0
                ? colors[theme].secondary
                : colors[theme].accent,
          },
        ]}
        onPress={() => onAdd(navigation, isEvent, eventId, invitees)}
        disabled={isEvent && invitees.length === 0}>
        <Text size="l" color={colors[theme].primary}>
          {invitees.length > 0
            ? `${isEvent ? strings.friends.invite : strings.main.save} (${
                invitees.length
              })`
            : isEvent
            ? strings.friends.invite
            : strings.main.save}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors[theme].primary,
      borderTopWidth: s(1),
      borderTopColor: colors[theme].accent,
    },
    button: {
      marginLeft: s(10),
      marginRight: s(20),
      marginTop: s(10),
      paddingHorizontal: s(20),
      height: s(45),
      justifyContent: 'center',
      borderRadius: s(10),
    },
    invitees: {
      marginTop: s(10),
      paddingHorizontal: s(20),
      height: s(60),
    },
    user: {
      marginRight: s(5),
      width: s(50),
      alignItems: 'center',
    },
    userIcon: {
      height: s(40),
    },
    name: {
      height: s(15),
    },
    checkmark: {
      position: 'absolute',
      top: -s(3),
      left: s(33),
      height: s(20),
      width: s(20),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
  });

export default Footer;
