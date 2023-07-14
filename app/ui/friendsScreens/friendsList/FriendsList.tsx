import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  StatusBar,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';

import FriendsContext from '../../../context/FriendsContext';

import {UserInfo} from '../../../utils/types';

import FriendGroupComponent from './FriendGroup';
import FriendGroupEdit from './FriendGroupEdit';
import {loadFriends} from './functions';

const FriendsList = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends, setFriends, setFriendGroups} = friendsContext;

  const [loading, setLoading] = useState(false);
  const [fgSelected, setFgSelected] = useState<number>(0);
  const [fgEditing, setFgEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>();
  const [tempMembers, setTempMembers] = useState<UserInfo[]>();

  return (
    <ScrollView
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={async () => {
            setLoading(true);
            await loadFriends(setFriends, setFriendGroups);
            setLoading(false);
          }}
          tintColor={colors[theme].accent}
        />
      }>
      <FriendGroupComponent
        navigation={navigation}
        setFgEditing={setFgEditing}
        fgSelected={fgSelected}
        setFgSelected={setFgSelected}
        setTempName={setTempName}
        setTempMembers={setTempMembers}
      />

      {fgSelected !== 0 ? (
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
        <Text size="s">{strings.friends.friends}:</Text>
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
            ) : (
              <Icon size="s" icon={icons.next} />
            )}
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
