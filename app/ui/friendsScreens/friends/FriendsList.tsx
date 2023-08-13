import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  StatusBar,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import {UserInfo} from '../../../utils/types';
import {useLoadingState} from '../../../utils/Misc';

import FriendGroupComponent from './FriendGroup';
import FriendGroupEdit from './FriendGroupEdit';
import {useFriendsContext} from '../../../context/FriendsContext';

const FriendsList = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const {friends, refreshFriends, friendGroups} = useFriendsContext();

  const [loading, withLoading] = useLoadingState();
  const [fgSelected, setFgSelected] = useState<number>(0);
  const [fgEditing, setFgEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>();
  const [tempMembers, setTempMembers] = useState<UserInfo[]>();

  const [fgHidden, setFgHidden] = useState<boolean>(false);

  return (
    <ScrollView
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      scrollIndicatorInsets={{right: 1}}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() =>
            withLoading(async () => {
              await refreshFriends();
            })
          }
          tintColor={colors[theme].accent}
        />
      }>
      <View style={styles.title}>
        <Text size="s" weight="l">
          {friendGroups.length === 1
            ? strings.friends.friendGroup
            : strings.friends.friendGroups}
          :
        </Text>
        <View
          style={{
            transform: [{rotate: fgHidden ? '180deg' : '0deg'}],
          }}>
          <Icon
            size="xs"
            icon={icons.drop}
            onPress={() => {
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setFgHidden(!fgHidden);
            }}
          />
        </View>
      </View>
      {!fgHidden ? (
        <FriendGroupComponent
          navigation={navigation}
          setFgEditing={setFgEditing}
          fgSelected={fgSelected}
          setFgSelected={setFgSelected}
          setTempName={setTempName}
          setTempMembers={setTempMembers}
        />
      ) : null}

      {!fgHidden && fgSelected !== 0 ? (
        <FriendGroupEdit
          navigation={navigation}
          fgEditing={fgEditing}
          setFgEditing={setFgEditing}
          fgSelected={fgSelected}
          setFgSelected={setFgSelected}
          tempName={tempName}
          setTempName={setTempName}
          tempMembers={tempMembers}
          setTempMembers={setTempMembers}
        />
      ) : null}

      <View style={styles.title}>
        <Text size="s" weight="l">
          {strings.friends.friends + ' (' + friends.length + ')'}:
        </Text>
      </View>

      {friends.map((item: UserInfo) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => {
            if (fgEditing) {
              if (tempMembers?.find(user => user.id === item.id)) {
                setTempMembers(tempMembers.filter(user => user.id !== item.id));
              } else {
                setTempMembers([...(tempMembers || []), item]);
              }
            } else {
              navigation.push('User', {
                user: item,
              });
            }
          }}>
          <UserRow user={item}>
            {fgEditing ? (
              <Icon
                size="m"
                color={colors[theme].accent}
                icon={
                  tempMembers?.find(user => user.id === item.id)
                    ? icons.selected
                    : icons.unselected
                }
              />
            ) : null}
          </UserRow>
        </TouchableOpacity>
      ))}
      {friends.length === 0 ? (
        <View style={STYLES.center}>
          <Text>{strings.friends.noFriendsFound}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: s(20),
    marginTop: s(10),
    marginBottom: s(5),
  },
});

export default FriendsList;
