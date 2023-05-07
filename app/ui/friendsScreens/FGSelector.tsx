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
import EncryptedStorage from 'react-native-encrypted-storage';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';

import {acceptInvite} from '../../utils/api/friendsCalls/acceptInvite';
import {rejectInvite} from '../../utils/api/friendsCalls/rejectInvite';
import {FriendGroup, Invitation} from '../../utils/interfaces/types';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import Text from '../components/Text';
import AButton from '../components/ActionButton';

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
    const token = await EncryptedStorage.getItem('auth_token');

    const response = await acceptInvite(invite_id, token);

    if (response) {
      refreshOnInviteEvent();
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleRejectInvite = async (invite_id: number) => {
    const token = await EncryptedStorage.getItem('auth_token');

    const response = await rejectInvite(invite_id, token);

    if (response) {
      refreshOnInviteEvent();
    } else {
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
          <Image style={styles.plusIcon} source={icons.x} />
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
    borderRadius: s(20),
    borderWidth: s(2),
    borderColor: colors.accent,
  },
  plusIcon: {
    width: '40%',
    height: '40%',
    transform: [{rotate: '45deg'}],
    tintColor: colors.accent,
  },
  texts: {
    marginLeft: s(12),
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: s(120),
    justifyContent: 'space-between',
  },
});

export default FGSelector;
