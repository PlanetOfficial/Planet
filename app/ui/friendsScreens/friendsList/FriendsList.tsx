import React, {useContext, useMemo} from 'react';
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

import FriendsContext from '../../../context/FriendsContext';

import {FriendGroup, UserInfo} from '../../../utils/types';
import {getFriends} from '../../../utils/api/friendsAPI';

import FGIcon from './FGIcon';
import {FlatList} from 'react-native-gesture-handler';
import UserIcon from '../../components/UserIcon';

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

  const [loading, setLoading] = React.useState(false);
  const loadFriends = async () => {
    const response = await getFriends();

    if (response) {
      setFriends(response.friends);
      setFriendGroups(response.friendgroups);
    } else {
      Alert.alert(strings.error.error, strings.error.loadFriendsList);
    }
  };

  const [fgSelected, setFgSelected] = React.useState(0);

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
          console.log(data);
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
              } else {
                setFgSelected(item.id);
              }
            }}>
            <FGIcon users={item.members} selected={fgSelected === item.id} />
            <Text size="s" weight={fgSelected === item.id ? 'r' : 'l'}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={AddButton}
      />

      {fgSelected !== 0 ? (
        <FlatList
          horizontal={true}
          style={styles.flatList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.friendIcons, STYLES.shadow]}
          data={friendGroups.find(fg => fg.id === fgSelected)?.members}
          keyExtractor={(item: UserInfo) => item.id.toString()}
          renderItem={({item}: {item: UserInfo}) => (
            <View style={styles.friendIconContainer}>
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
              <View style={styles.text}>
                <Text size="xs" weight="l" numberOfLines={1}>
                  {item.first_name}
                </Text>
              </View>
            </View>
          )}
        />
      ) : null}

      <View style={styles.title}>
        <Text weight="l">{strings.friends.friends}:</Text>
      </View>

      {friends.map((item: UserInfo) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            navigation.push('User', {
              user: item,
            })
          }>
          <UserRow user={item}>
            <Icon size="xs" icon={icons.next} />
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
      margin: s(10),
      padding: s(10),
      marginRight: s(50),
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
  });

export default FriendsList;
