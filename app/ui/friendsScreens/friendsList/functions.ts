import {Alert, LayoutAnimation} from 'react-native';

import strings from '../../../constants/strings';

import {FriendGroup, UserInfo} from '../../../utils/types';
import {deleteFG, editFG, reorderFG} from '../../../utils/api/fgAPI';
import {useFriendsContext} from '../../../context/FriendsContext';

export const handleFGReorder = async (data: FriendGroup[]) => {
  const response = await reorderFG(data.map(fg => fg.id));
  if (!response) {
    Alert.alert(strings.error.error, strings.error.reorderFG);
  }
};

export const beginFGEditing = (
  friendGroups: FriendGroup[],
  setFgEditing: (fgEditing: boolean) => void,
  setTempName: (tempName: string | undefined) => void,
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void,
  fgSelected: number,
) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  setTempName(friendGroups.find(fg => fg.id === fgSelected)?.name || '');
  setTempMembers(friendGroups.find(fg => fg.id === fgSelected)?.members || []);
  setFgEditing(true);
};

export const resetFGEditing = (
  setFgEditing: (fgEditing: boolean) => void,
  setTempName: (tempName: string | undefined) => void,
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void,
) => {
  setFgEditing(false);
  setTempName(undefined);
  setTempMembers(undefined);
};

export const saveFGEditing = async (
  fgSelected: number,
  tempName: string | undefined,
  tempMembers: UserInfo[] | undefined,
  setFgEditing: (fgEditing: boolean) => void,
) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  if (!tempMembers || !tempName) {
    return;
  }

  const response = await editFG(
    fgSelected,
    tempMembers.map(user => user.id),
    tempName,
  );

  if (response) {
    setFgEditing(false);
    const {refreshFriends} = useFriendsContext();
    await refreshFriends();
  } else {
    Alert.alert(strings.error.error, strings.error.editFGName);
  }
};

export const handleRemoveFG = async (
  fgSelected: number,
  setFgSelected: (fgSelected: number) => void,
  setFgEditing: (fgEditing: boolean) => void,
  setTempName: (tempName: string | undefined) => void,
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void,
) => {
  const response = await deleteFG(fgSelected);

  if (response) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFgSelected(0);
    resetFGEditing(setFgEditing, setTempName, setTempMembers);
    const {refreshFriends} = useFriendsContext();
    await refreshFriends();
  } else {
    Alert.alert(strings.error.error, strings.error.deleteFG);
  }
};
