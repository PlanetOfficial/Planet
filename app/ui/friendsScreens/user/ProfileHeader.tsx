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

import {handleBlock, handleReport} from './functions';
import {useFriendsContext} from '../../../context/FriendsContext';

interface Props {
  navigation: any;
  user: UserInfo;
  isSelf: boolean;
  isPage: boolean;
}

const ProfileHeader: React.FC<Props> = ({navigation, user, isSelf, isPage}) => {
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
          {isPage ? (
            <Icon
              size="m"
              icon={icons.back}
              color={colors.light.primary}
              onPress={() => navigation.goBack()}
            />
          ) : (
            <View />
          )}
          {isSelf ? (
            <Icon
              size="m"
              icon={icons.settings}
              color={colors.light.primary}
              onPress={() => navigation.navigate('Settings')}
            />
          ) : (
            // TODO: change wording
            <OptionMenu
              iconColor={colors.light.primary}
              options={[
                {
                  name: strings.friends.block,
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
                  name: strings.friends.report,
                  onPress: () =>
                    Alert.alert(
                      strings.friends.report,
                      strings.friends.reportInfo,
                      [
                        {text: strings.main.cancel},
                        {
                          text: strings.friends.report,
                          style: 'destructive',
                          onPress: () => {
                            handleReport(user.id);
                          },
                        },
                      ],
                    ),
                  color: colors[theme].neutral,
                },
              ]}
            />
          )}
        </View>
      </SafeAreaView>
      <View style={[styles.card, STYLES.shadow]}>
        <View style={styles.profilePic}>
          <UserIconXL user={user} />
        </View>
        <Text size="l" numberOfLines={1}>
          {user.first_name} {user.last_name}
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
  });

export default ProfileHeader;
