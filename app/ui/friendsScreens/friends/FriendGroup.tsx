import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import FGIcon from '../components/FGIcon';

import {FriendGroup, UserInfo} from '../../../utils/types';

import {useFriendsContext} from '../../../context/FriendsContext';

import {resetFGEditing} from './functions';

interface Props {
  navigation: any;
  setFgEditing: (editing: boolean) => void;
  fgSelected: number;
  setFgSelected: (id: number) => void;
  setTempName: (tempName: string | undefined) => void;
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void;
}

const FriendGroupComponent: React.FC<Props> = ({
  navigation,
  setFgEditing,
  fgSelected,
  setFgSelected,
  setTempName,
  setTempMembers,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  const {friendGroups} = useFriendsContext();

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.friendGroups}>
      {friendGroups.map((item: FriendGroup) => (
        <TouchableOpacity
          key={item.id}
          style={styles.friendGroup}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );

            setFgSelected(fgSelected === item.id ? 0 : item.id);
            resetFGEditing(setFgEditing, setTempName, setTempMembers);
          }}>
          <FGIcon users={item.members} selected={fgSelected === item.id} />
          <Text size="s" weight={fgSelected === item.id ? 'r' : 'l'}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={styles.friendGroup}
        onPress={() => navigation.navigate('CreateFG')}>
        <View style={styles.add}>
          <Icon icon={icons.add} color={colors[theme].accent} size="xl" />
        </View>
        <Text size="s" weight="l">
          {strings.friends.newFriendGroup}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    friendGroups: {
      paddingHorizontal: s(10),
      minWidth: s(350),
      marginBottom: s(10),
    },
    friendGroup: {
      alignItems: 'center',
      margin: s(10),
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: s(20),
      marginTop: s(10),
      marginBottom: s(5),
    },
    add: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(75),
      height: s(75),
      borderRadius: s(37.5),
      backgroundColor: colors[theme].primary,
      borderColor: colors[theme].accent,
    },
  });

export default FriendGroupComponent;
