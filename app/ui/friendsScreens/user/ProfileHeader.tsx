import React from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';
import {Defs, LinearGradient, Path, Stop, Svg} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import OptionMenu from '../../components/OptionMenu';
import UserIconXL from '../../components/UserIconXL';

import {UserInfo} from '../../../utils/types';

import {useFriendsContext} from '../../../context/FriendsContext';

import {handleBlock, handleReport, handleUnfriend} from './functions';
import {handleEditPfp} from '../../profileScreens/settingsScreens/functions';

interface Props {
  navigation: any;
  user: UserInfo;
  isSelf: boolean;
  isOnTabScreen: boolean;
  setPfpURL?: (url: string) => void;
}

const ProfileHeader: React.FC<Props> = ({
  navigation,
  user,
  isSelf,
  isOnTabScreen = false,
  setPfpURL,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  const styles = styling(theme);

  const insets = useSafeAreaInsets();

  const {
    friends,
    setFriends,
    requests,
    setRequests,
    requestsSent,
    setRequestsSent,
    usersIBlock,
    setUsersIBlock,
  } = useFriendsContext();

  const options = [
    {
      name: strings.friends.block + ' @' + user.username,
      onPress: () =>
        handleBlock(
          friends,
          setFriends,
          requests,
          setRequests,
          requestsSent,
          setRequestsSent,
          usersIBlock,
          setUsersIBlock,
          user,
        ),
      color: colors[theme].red,
      disabled: usersIBlock.some(b => b.id === user.id),
    },
    {
      name: strings.friends.report + ' @' + user.username,
      onPress: () =>
        Alert.alert(strings.friends.report, strings.friends.reportInfo, [
          {text: strings.main.cancel},
          {
            text: strings.friends.report,
            style: 'destructive',
            onPress: () => handleReport(user.id),
          },
        ]),
      color: colors[theme].red,
    },
  ];
  if (friends.some(friend => friend.id === user.id)) {
    options.unshift({
      name: strings.friends.unfriend,
      onPress: () =>
        Alert.alert(strings.friends.unfriend, strings.friends.unfriendInfo, [
          {text: strings.main.cancel},
          {
            text: strings.friends.unfriend,
            style: 'destructive',
            onPress: () => handleUnfriend(user.id, friends, setFriends),
          },
        ]),
      color: colors[theme].red,
    });
  }

  return (
    <>
      <View style={STYLES.absolute}>
        <Svg width={s(350)} height={s(190) + insets.top} fill="none">
          <Path
            fill="url(#a)"
            d={`M0 0h${s(350)}v${s(185) + insets.top}L0 ${
              s(140) + insets.top
            }V0Z`}
          />
          <Defs>
            <LinearGradient
              id="a"
              x1={s(350)}
              x2={-s(350)}
              y1={s(185) + insets.top}
              y2={-s(185)}
              gradientUnits="userSpaceOnUse">
              <Stop stopColor={colors.light.accent} />
              <Stop offset={1} stopColor={colors.light.primary} />
            </LinearGradient>
          </Defs>
        </Svg>
      </View>
      <SafeAreaView>
        <View style={STYLES.header}>
          {!isOnTabScreen ? (
            <Icon
              size="m"
              icon={icons.back}
              color={colors[theme].primary}
              onPress={() => navigation.goBack()}
            />
          ) : isSelf ? (
            <Icon
              size="m"
              icon={icons.friends}
              color={colors[theme].primary}
              onPress={() => navigation.navigate('Friends')}
            />
          ) : null}
          {isSelf ? (
            <Icon
              size="m"
              icon={icons.settings}
              color={colors[theme].primary}
              onPress={() => navigation.navigate('Settings')}
            />
          ) : (
            <OptionMenu iconColor={colors[theme].primary} options={options} />
          )}
        </View>
      </SafeAreaView>
      <View style={[styles.card, STYLES.shadow]}>
        <View style={styles.profilePic}>
          <UserIconXL user={user} />
        </View>
        {isSelf && setPfpURL !== undefined ? (
          <View style={styles.edit}>
            <Icon
              padding={user.icon?.url ? 0 : 1}
              icon={user.icon?.url ? icons.edit : icons.plus}
              color={
                user.icon?.url ? colors[theme].neutral : colors[theme].accent
              }
              onPress={() => handleEditPfp(setPfpURL)}
            />
          </View>
        ) : null}
        <Text size="l" numberOfLines={1}>
          {user.display_name}
        </Text>
        <Text size="s" weight="l" numberOfLines={1}>
          @{user.username}
        </Text>
        <View style={styles.status}>
          {/* TODO: Change status */}
          <Text color={colors[theme].accent} numberOfLines={1}>
            Master Planner
          </Text>
        </View>
      </View>
    </>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    card: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: s(30),
      marginBottom: s(10),
      width: s(310),
      height: s(150),
      borderRadius: s(20),
      backgroundColor: colors[theme].primary,
    },
    profilePic: {
      width: s(100),
      height: s(100),
      borderRadius: s(50),
      overflow: 'hidden',
      marginTop: -s(50),
      borderWidth: 2,
      borderColor: colors[theme].primary,
    },
    status: {
      marginTop: s(10),
      marginBottom: s(15),
    },
    edit: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      width: s(25),
      height: s(25),
      top: -s(47.5),
      left: s(177.5),
      borderRadius: s(12.5),
      backgroundColor: colors[theme].primary,
    },
  });

export default ProfileHeader;
