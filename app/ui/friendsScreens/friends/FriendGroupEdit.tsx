import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';
import prompt from 'react-native-prompt-android';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserIcon from '../../components/UserIcon';

import {UserInfo} from '../../../utils/types';
import {beginFGEditing, handleRemoveFG, saveFGEditing} from './functions';
import {useFriendsContext} from '../../../context/FriendsContext';

interface Props {
  navigation: any;
  fgEditing: boolean;
  setFgEditing: (editing: boolean) => void;
  fgSelected: number;
  setFgSelected: (id: number) => void;
  tempName: string | undefined;
  setTempName: (tempName: string | undefined) => void;
  tempMembers: UserInfo[] | undefined;
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void;
}

const FriendGroupEdit: React.FC<Props> = ({
  navigation,
  fgEditing,
  setFgEditing,
  fgSelected,
  setFgSelected,
  tempName,
  setTempName,
  tempMembers,
  setTempMembers,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const {
    friendGroups,
    setFriends,
    setFriendGroups,
    setUsersIBlock,
    setUsersBlockingMe,
    setRequests,
    setRequestsSent,
    setSuggestions,
  } = useFriendsContext();

  return (
    <>
      <View style={styles.friendsHeader}>
        <TouchableOpacity
          disabled={!fgEditing}
          onPress={() =>
            prompt(
              strings.main.rename,
              strings.friends.renameFriendGroup,
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Save',
                  onPress: (name: string) => setTempName(name),
                },
              ],
              {
                defaultValue: tempName,
              },
            )
          }>
          <Text size="s" underline={fgEditing}>
            {tempName || friendGroups.find(fg => fg.id === fgSelected)?.name}
          </Text>
        </TouchableOpacity>
        <View style={STYLES.row}>
          <TouchableOpacity
            onPress={() => {
              if (fgEditing) {
                saveFGEditing(
                  fgSelected,
                  tempName,
                  tempMembers,
                  setFgEditing,
                  setFriends,
                  setFriendGroups,
                  setUsersIBlock,
                  setUsersBlockingMe,
                  setRequests,
                  setRequestsSent,
                  setSuggestions,
                );
              } else {
                beginFGEditing(
                  friendGroups,
                  setFgEditing,
                  setTempName,
                  setTempMembers,
                  fgSelected,
                );
              }
            }}>
            <Text size="s">
              {fgEditing ? strings.main.save : strings.main.edit}
            </Text>
          </TouchableOpacity>
          {fgEditing ? (
            <TouchableOpacity
              style={styles.delete}
              onPress={() =>
                Alert.alert(
                  strings.friends.deleteFriendGroup,
                  strings.friends.deleteFriendGroupInfo,
                  [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'Delete',
                      onPress: () =>
                        handleRemoveFG(
                          fgSelected,
                          setFgSelected,
                          setFgEditing,
                          setTempName,
                          setTempMembers,
                          setFriends,
                          setFriendGroups,
                          setUsersIBlock,
                          setUsersBlockingMe,
                          setRequests,
                          setRequestsSent,
                          setSuggestions,
                        ),
                      style: 'destructive',
                    },
                  ],
                )
              }>
              <Text size="s" color={colors[theme].red}>
                {strings.main.remove}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <ScrollView
        horizontal={true}
        style={styles.flatList}
        showsHorizontalScrollIndicator={false}>
        <View style={[styles.friendIcons, STYLES.shadow]}>
          {(
            tempMembers ||
            friendGroups.find(fg => fg.id === fgSelected)?.members
          )?.map((item: UserInfo) => (
            <View style={styles.friendIconContainer} key={item.id}>
              <TouchableOpacity
                style={styles.friendIcon}
                key={item.id}
                onPress={() =>
                  navigation.push('User', {
                    user: item,
                  })
                }>
                <UserIcon user={item} />
              </TouchableOpacity>
              {fgEditing ? (
                <TouchableOpacity
                  style={styles.minus}
                  onPress={() => {
                    if (fgEditing) {
                      setTempMembers(
                        tempMembers?.filter(user => user.id !== item.id) || [],
                      );
                    }
                  }}>
                  <Icon
                    size="m"
                    icon={icons.minus}
                    color={colors[theme].accent}
                  />
                </TouchableOpacity>
              ) : null}
              <View style={styles.text}>
                <Text size="xs" weight="l" numberOfLines={1}>
                  {item.display_name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    add: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: s(20),
      marginHorizontal: s(50),
      paddingHorizontal: s(20),
      paddingVertical: s(10),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
    addText: {
      marginLeft: s(10),
    },
    flatList: {
      paddingLeft: s(10),
    },
    friendIcons: {
      flexDirection: 'row',
      margin: s(10),
      padding: s(10),
      marginRight: s(30),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
    friendIconContainer: {
      alignItems: 'center',
      marginHorizontal: s(10),
    },
    friendIcon: {
      width: s(50),
      height: s(50),
    },
    friendsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: s(20),
    },
    text: {
      marginTop: s(5),
      maxWidth: s(60),
    },
    minus: {
      position: 'absolute',
      top: -s(3),
      left: s(33),
      height: s(20),
      width: s(20),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
    delete: {
      marginLeft: s(20),
    },
  });

export default FriendGroupEdit;
