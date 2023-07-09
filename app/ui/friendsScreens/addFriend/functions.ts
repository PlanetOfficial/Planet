import {LayoutAnimation, Alert} from 'react-native';

import strings from '../../../constants/strings';

import {FriendGroup, UserInfo} from '../../../utils/types';
import {inviteToEvent} from '../../../utils/api/eventAPI';

export const handleFGSelect = (
  item: FriendGroup,
  invitees: UserInfo[],
  setInvitees: (invitees: UserInfo[]) => void,
  setFgSelected: (fgSelected: number) => void,
) => {
  if (
    !item.members.every(
      member => invitees?.find(user => user.id === member.id) !== undefined,
    )
  ) {
    setInvitees(
      invitees.concat(
        item.members.filter(
          member => invitees?.find(user => user.id === member.id) === undefined,
        ),
      ),
    );
  } else {
    setInvitees(
      invitees.filter(
        user =>
          item.members.find(member => member.id === user.id) === undefined,
      ),
    );
  }
  setFgSelected(item.id);
};

export const handleFGPress = (
  item: FriendGroup,
  fgSelected: number,
  setFgSelected: (fgSelected: number) => void,
) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  if (fgSelected === item.id) {
    setFgSelected(0);
  } else {
    setFgSelected(item.id);
  }
};

export const handleUserSelect = (
  item: UserInfo,
  invitees: UserInfo[],
  setInvitees: (invitees: UserInfo[]) => void,
) => {
  if (invitees?.find(user => user.id === item.id)) {
    setInvitees(invitees.filter(user => user.id !== item.id));
  } else {
    setInvitees([...(invitees || []), item]);
  }
};

export const onAdd = async (
  navigation: any,
  isEvent: boolean,
  eventId: number | undefined,
  invitees: UserInfo[],
) => {
  if (isEvent && eventId) {
    const response = await inviteToEvent(
      eventId,
      invitees.map(invitee => invitee.id),
    );

    if (response) {
      navigation.goBack();
    } else {
      Alert.alert(strings.error.error, strings.error.inviteUsers);
    }
  } else {
    navigation.navigate('Create', {members: invitees});
  }
};
