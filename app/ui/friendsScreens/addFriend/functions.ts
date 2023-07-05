import {LayoutAnimation} from 'react-native';

import icons from '../../../constants/icons';

import {FriendGroup, UserInfo} from '../../../utils/types';

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
    setInvitees([...(invitees || []), ...item.members]);
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

export const findFGIcon = (item: FriendGroup, invitees: UserInfo[]) => {
  return item.members.every(
    member => invitees?.find(user => user.id === member.id) !== undefined,
  )
    ? icons.selected
    : item.members.some(
        member => invitees?.find(user => user.id === member.id) !== undefined,
      )
    ? icons.minus
    : icons.unselected;
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
