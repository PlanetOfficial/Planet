import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';

import strings from '../../constants/strings';
import {colors} from '../../constants/colors';
import {icons} from '../../constants/icons';

import Text from '../components/Text';
import AButton from '../components/ActionButton';
import Icon from '../components/Icon';

import {acceptInvite, rejectInvite} from '../../utils/api/groups/inviteAPI';
import {Group, Invite} from '../../utils/interfaces/types';

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  groups: Group[];
  group: number;
  setGroup: (group: number) => void;
  refreshOnInviteEvent: () => void;
  invites: Invite[];
  navigation: any;
}

const GroupSelector: React.FC<Props> = ({
  bottomSheetRef,
  groups,
  group,
  setGroup,
  refreshOnInviteEvent,
  invites,
  navigation,
}) => {
  const handleAcceptInvite = async (invite_id: number) => {
    const response = await acceptInvite(invite_id);

    if (response) {
      refreshOnInviteEvent();
    } else {
      Alert.alert('Error', 'Unable to accept invite. Please try again');
    }
  };

  const handleRejectInvite = async (invite_id: number) => {
    const response = await rejectInvite(invite_id);

    if (response) {
      refreshOnInviteEvent();
    } else {
      Alert.alert('Error', 'Unable to reject invite. Please try again');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {groups?.map((_group: Group, idx: number) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.row,
            {
              backgroundColor:
                _group === groups[group] ? colors.grey : colors.white,
            },
          ]}
          onPress={() => {
            setGroup(idx);
            bottomSheetRef.current?.dismiss();
          }}>
          <Image style={styles.icon} source={icons.user} />
          <View style={styles.texts}>
            <Text
              color={_group === groups[group] ? colors.accent : colors.black}>
              {_group.name}
            </Text>
          </View>
          <Icon
            size="m"
            icon={icons.option}
            onPress={() => {
              navigation.navigate('EditGroup', {group: _group});
              bottomSheetRef.current?.dismiss();
            }}
          />
        </TouchableOpacity>
      ))}
      {invites?.map((invite: Invite, idx: number) => (
        <View key={idx} style={styles.row}>
          <Image style={styles.icon} source={icons.user} />
          <View style={styles.wrap}>
            <View style={styles.texts}>
              <Text>{invite.group.name}</Text>
              <Text size="xs" weight="l" color={colors.darkgrey}>
                {invite.inviter.name}
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <AButton
                size="xs"
                label={strings.groups.accept}
                onPress={() => {
                  handleAcceptInvite(invite.id);
                }}
              />
              <AButton
                size="xs"
                label={strings.groups.decline}
                color={colors.darkgrey}
                onPress={() => {
                  handleRejectInvite(invite.id);
                }}
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          bottomSheetRef.current?.dismiss();
          navigation.navigate('CreateGroup');
        }}>
        <View style={styles.plus}>
          <Image style={styles.plusIcon} source={icons.plus} />
        </View>
        <View style={styles.texts}>
          <Text>{strings.groups.createPrompt}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: s(20),
  },
  background: {
    backgroundColor: colors.white,
  },
  wrap: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: s(20),
    alignItems: 'center',
    height: s(70),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  icon: {
    width: s(40),
    height: s(40),
  },
  plus: {
    justifyContent: 'center',
    alignItems: 'center',
    width: s(40),
    height: s(40),
  },
  plusIcon: {
    width: '100%',
    height: '100%',
    tintColor: colors.accent,
  },
  texts: {
    marginLeft: s(12),
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(110),
    marginLeft: s(10),
  },
});

export default GroupSelector;
