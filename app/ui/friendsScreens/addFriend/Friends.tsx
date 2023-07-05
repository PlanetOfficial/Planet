import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import UserIcon from '../../components/UserIcon';
import Text from '../../components/Text';
import UserRow from '../../components/UserRow';

import FriendsContext from '../../../context/FriendsContext';

import {FriendGroup, UserInfo} from '../../../utils/types';

import FGIcon from '../friendsList/FGIcon';
import {
  findFGIcon,
  handleFGPress,
  handleFGSelect,
  handleUserSelect,
} from './functions';

interface Props {
  fgSelected: number;
  setFgSelected: (id: number) => void;
  invitees: UserInfo[];
  setInvitees: (invitees: UserInfo[]) => void;
}

const Friends: React.FC<Props> = ({
  fgSelected,
  setFgSelected,
  invitees,
  setInvitees,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends, friendGroups} = friendsContext;

  return (
    <ScrollView
      style={STYLES.container}>
      <View style={styles.title}>
        <Text weight="l">
          {friendGroups.length === 1
            ? strings.friends.friendGroup
            : strings.friends.friendGroups}
          :
        </Text>
      </View>
      <FlatList
        horizontal={true}
        data={friendGroups}
        contentContainerStyle={styles.friendGroups}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: FriendGroup) => item.id.toString()}
        renderItem={({item}: {item: FriendGroup}) => (
          <TouchableOpacity
            key={item.id}
            style={styles.friendGroup}
            onPress={() => handleFGPress(item, fgSelected, setFgSelected)}>
            <FGIcon users={item.members} selected={fgSelected === item.id} />
            <TouchableOpacity
              style={styles.checkmarkBig}
              onPress={() =>
                handleFGSelect(item, invitees, setInvitees, setFgSelected)
              }>
              <Icon
                size="l"
                icon={findFGIcon(item, invitees)}
                color={colors[theme].accent}
              />
            </TouchableOpacity>
            <Text size="s" weight={fgSelected === item.id ? 'r' : 'l'}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {fgSelected !== 0 ? (
        <ScrollView
          horizontal={true}
          style={styles.flatList}
          showsHorizontalScrollIndicator={false}>
          <View style={[styles.friendIcons, STYLES.shadow]}>
            {friendGroups
              .find(fg => fg.id === fgSelected)
              ?.members?.map((item: UserInfo) => (
                <TouchableOpacity
                  style={styles.friendIconContainer}
                  key={item.id}
                  onPress={() => handleUserSelect(item, invitees, setInvitees)}>
                  <View style={styles.friendIcon}>
                    <UserIcon user={item} />
                  </View>
                  <View style={styles.checkmark}>
                    <Icon
                      size="m"
                      icon={
                        invitees?.find(user => user.id === item.id)
                          ? icons.selected
                          : icons.unselected
                      }
                      color={colors[theme].accent}
                    />
                  </View>
                  <View style={styles.text}>
                    <Text size="xs" weight="l" numberOfLines={1}>
                      {item.first_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        </ScrollView>
      ) : null}

      <View style={styles.title}>
        <Text weight="l">{strings.friends.friends}:</Text>
      </View>
      {friends.map((item: UserInfo) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => handleUserSelect(item, invitees, setInvitees)}>
          <UserRow user={item}>
            <Icon
              size="m"
              color={colors[theme].accent}
              icon={
                invitees?.find(user => user.id === item.id)
                  ? icons.selected
                  : icons.unselected
              }
            />
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

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: s(20),
      marginTop: s(10),
      marginBottom: s(5),
    },
    friendGroups: {
      paddingHorizontal: s(10),
      minWidth: s(350),
    },
    friendGroup: {
      alignItems: 'center',
      margin: s(10),
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
    text: {
      marginTop: s(5),
      maxWidth: s(60),
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
    checkmarkBig: {
      position: 'absolute',
      top: s(50),
      left: s(55),
      height: s(24),
      width: s(24),
      borderRadius: s(12),
      backgroundColor: colors[theme].primary,
    },
  });

export default Friends;
