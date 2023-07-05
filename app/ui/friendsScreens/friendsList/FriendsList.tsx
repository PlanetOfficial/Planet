import React, {useContext, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  RefreshControl,
  useColorScheme,
  StatusBar,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import {s} from 'react-native-size-matters';
import DraggableFlatList from 'react-native-draggable-flatlist';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import UserRow from '../../components/UserRow';
import UserIcon from '../../components/UserIcon';

import FriendsContext from '../../../context/FriendsContext';

import {FriendGroup, UserInfo} from '../../../utils/types';
import {getFriends} from '../../../utils/api/friendsAPI';
import {deleteFG, editFG, reorderFG} from '../../../utils/api/fgAPI';

import FGIcon from './FGIcon';
import prompt from 'react-native-prompt-android';

const FriendsList = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {friends, setFriends, friendGroups, setFriendGroups} = friendsContext;

  const [loading, setLoading] = useState(false);
  const loadFriends = async () => {
    const response = await getFriends();

    if (response) {
      setFriends(response.friends);
      setFriendGroups(response.friendgroups);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  const [fgSelected, setFgSelected] = useState<number>(0);
  const [fgEditing, setFgEditing] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>();
  const [tempMembers, setTempMembers] = useState<UserInfo[]>();

  const AddButton = useMemo(
    () => (
      <TouchableOpacity
        style={[styles.add, STYLES.shadow]}
        onPress={() => navigation.navigate('CreateFG')}>
        <Icon size="m" icon={icons.add} color={colors[theme].accent} />
        <View style={styles.addText}>
          <Text size="s" color={colors[theme].accent}>
            {strings.friends.createFriendGroup}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [STYLES, styles, theme, navigation],
  );

  const handleFGReorder = async (data: FriendGroup[]) => {
    const response = await reorderFG(data.map(fg => fg.id));
    if (!response) {
      Alert.alert(strings.error.error, strings.error.reorderFG);
    }
  };

  const beginFGEditing = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTempName(friendGroups.find(fg => fg.id === fgSelected)?.name || '');
    setTempMembers(
      friendGroups.find(fg => fg.id === fgSelected)?.members || [],
    );
    setFgEditing(true);
  };

  const resetFGEditing = () => {
    setTempName(undefined);
    setTempMembers(undefined);
    setFgEditing(false);
  };

  const saveFGEditing = async () => {
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
      loadFriends();
    } else {
      Alert.alert(strings.error.error, strings.error.editFGName);
    }
  };

  const handleRemoveFG = async () => {
    const response = await deleteFG(fgSelected);

    if (response) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFgSelected(0);
      resetFGEditing();
      loadFriends();
    } else {
      Alert.alert(strings.error.error, strings.error.deleteFG);
    }
  };

  return (
    <ScrollView
      style={STYLES.container}
      contentContainerStyle={STYLES.flatList}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={async () => {
            setLoading(true);
            await loadFriends();
            setLoading(false);
          }}
          tintColor={colors[theme].accent}
        />
      }>
      <View style={styles.title}>
        <Text weight="l">
          {friendGroups.length === 1
            ? strings.friends.friendGroup
            : strings.friends.friendGroups}
          :
        </Text>
        <Icon
          icon={icons.add}
          color={colors[theme].accent}
          onPress={() => navigation.navigate('CreateFG')}
        />
      </View>
      <DraggableFlatList
        horizontal={true}
        data={friendGroups}
        contentContainerStyle={styles.friendGroups}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item: FriendGroup) => item.id.toString()}
        onDragEnd={({data}) => {
          setFriendGroups(data);
          handleFGReorder(data);
        }}
        renderItem={({
          item,
          drag,
          isActive,
        }: {
          item: FriendGroup;
          drag: () => void;
          isActive: boolean;
        }) => (
          <>
            <TouchableOpacity
              key={item.id}
              style={styles.friendGroup}
              delayLongPress={500}
              onLongPress={drag}
              disabled={isActive}
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                if (fgSelected === item.id) {
                  setFgSelected(0);
                  resetFGEditing();
                } else {
                  setFgSelected(item.id);
                  resetFGEditing();
                }
              }}>
              <FGIcon users={item.members} selected={fgSelected === item.id} />
              <Text size="s" weight={fgSelected === item.id ? 'r' : 'l'}>
                {item.name}
              </Text>
            </TouchableOpacity>
            {fgSelected === item.id && fgEditing ? (
              <TouchableOpacity
                style={styles.minusBig}
                onPress={() =>
                  Alert.alert(
                    strings.friends.deleteFriendGroup,
                    strings.friends.deleteFriendGroupInfo,
                    [
                      {text: 'Cancel', style: 'cancel'},
                      {
                        text: 'Delete',
                        onPress: handleRemoveFG,
                        style: 'destructive',
                      },
                    ],
                  )
                }>
                <Icon
                  size="l"
                  icon={icons.minus}
                  color={colors[theme].accent}
                />
              </TouchableOpacity>
            ) : null}
          </>
        )}
        ListEmptyComponent={AddButton}
      />

      {fgSelected !== 0 ? (
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
                {tempName ||
                  friendGroups.find(fg => fg.id === fgSelected)?.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (fgEditing) {
                  saveFGEditing();
                } else {
                  beginFGEditing();
                }
              }}>
              <Text size="s">
                {fgEditing ? strings.main.save : strings.main.edit}
              </Text>
            </TouchableOpacity>
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
                            tempMembers?.filter(user => user.id !== item.id) ||
                              [],
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
                      {item.first_name}
                    </Text>
                  </View>
                </View>
              ))}
              {fgEditing ? (
                <View style={styles.friendIconContainer}>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddFriend')}>
                    <Icon
                      size="xl"
                      icon={icons.add}
                      color={colors[theme].accent}
                    />
                  </TouchableOpacity>
                  <View style={styles.text}>
                    <Text size="xs" weight="l" numberOfLines={1}>
                      {strings.main.add}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </>
      ) : null}

      <View style={styles.title}>
        <Text weight="l">{strings.friends.friends}:</Text>
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

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    friendGroups: {
      paddingHorizontal: s(10),
      minWidth: s(350),
    },
    friendGroup: {
      alignItems: 'center',
      margin: s(10),
    },
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
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: s(20),
      marginTop: s(10),
      marginBottom: s(5),
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
    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(50),
      height: s(50),
    },
    text: {
      marginTop: s(5),
      maxWidth: s(60),
    },
    minusBig: {
      position: 'absolute',
      top: s(62),
      left: s(62),
      height: s(24),
      width: s(24),
      borderRadius: s(12),
      backgroundColor: colors[theme].primary,
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
  });

export default FriendsList;
