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
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import Text from '../components/Text';
import AButton from '../components/ActionButton';
import Icon from '../components/Icon';

import {acceptInvite} from '../../utils/api/friendsCalls/acceptInvite';
import {rejectInvite} from '../../utils/api/friendsCalls/rejectInvite';
import {FriendGroup, Invitation} from '../../utils/interfaces/types';

interface Props {
  bottomSheetRef: React.RefObject<BottomSheetModalMethods>;
  friendGroups: FriendGroup[];
  friendGroup: number;
  setFriendGroup: (friendGroup: number) => void;
  refreshOnInviteEvent: () => void;
  invitations: Invitation[];
  navigation: any;
}

const FGSelector: React.FC<Props> = ({
  bottomSheetRef,
  friendGroups,
  friendGroup,
  setFriendGroup,
  refreshOnInviteEvent,
  invitations,
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
      {friendGroups?.map((fg: FriendGroup, idx: number) => (
        <TouchableOpacity
          key={idx}
          style={[
            styles.row,
            {
              backgroundColor: idx === friendGroup ? colors.grey : colors.white,
            },
          ]}
          onPress={() => {
            setFriendGroup(idx);
            bottomSheetRef.current?.close();
          }}>
          <Image style={styles.icon} source={icons.user} />
          <View style={styles.texts}>
            <Text color={idx === friendGroup ? colors.accent : colors.black}>
              {fg.group.name}
            </Text>
          </View>
          <Icon
            icon={icons.option}
            onPress={() => {
              navigation.navigate('EditFG', {friendGroup: fg});
              bottomSheetRef.current?.close();
            }}
          />
        </TouchableOpacity>
      ))}
      {invitations?.map((invitation: Invitation, idx: number) => (
        <View key={idx} style={styles.row}>
          <Image style={styles.icon} source={icons.user} />
          <View style={styles.wrap}>
            <View style={styles.texts}>
              <Text>{invitation.group.name}</Text>
              <Text size="xs" weight="l" color={colors.darkgrey}>
                {invitation.inviter.name}
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <AButton
                size="xs"
                label={strings.friends.accept}
                onPress={() => {
                  handleAcceptInvite(invitation.id);
                }}
              />
              <AButton
                size="xs"
                label={strings.friends.decline}
                color={colors.darkgrey}
                onPress={() => {
                  handleRejectInvite(invitation.id);
                }}
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          bottomSheetRef.current?.close();
          navigation.navigate('CreateFG');
        }}>
        <View style={styles.plus}>
          <Image style={styles.plusIcon} source={icons.plus} />
        </View>
        <View style={styles.texts}>
          <Text>{strings.friends.createPrompt}</Text>
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

export default FGSelector;
