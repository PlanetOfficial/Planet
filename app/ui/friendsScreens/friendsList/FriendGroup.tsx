import React, {useContext, useMemo} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  useColorScheme,
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

import FriendsContext from '../../../context/FriendsContext';

import {FriendGroup, UserInfo} from '../../../utils/types';

import FGIcon from './FGIcon';
import {handleFGReorder, handleRemoveFG, resetFGEditing} from './functions';

interface Props {
  navigation: any;
  fgEditing: boolean;
  setFgEditing: (editing: boolean) => void;
  fgSelected: number;
  setFgSelected: (id: number) => void;
  setTempName: (tempName: string | undefined) => void;
  setTempMembers: (tempMembers: UserInfo[] | undefined) => void;
}

const FriendGroupComponent: React.FC<Props> = ({
  navigation,
  fgEditing,
  setFgEditing,
  fgSelected,
  setFgSelected,
  setTempName,
  setTempMembers,
}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);

  const friendsContext = useContext(FriendsContext);
  if (!friendsContext) {
    throw new Error('FriendsContext is not set!');
  }
  const {setFriends, friendGroups, setFriendGroups} = friendsContext;

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
    <>
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
                  resetFGEditing(setFgEditing, setTempName, setTempMembers);
                } else {
                  setFgSelected(item.id);
                  resetFGEditing(setFgEditing, setTempName, setTempMembers);
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
                        onPress: () =>
                          handleRemoveFG(
                            fgSelected,
                            setFgSelected,
                            setFgEditing,
                            setTempName,
                            setTempMembers,
                            setFriends,
                            setFriendGroups,
                          ),
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
    </>
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
    minusBig: {
      position: 'absolute',
      top: s(62),
      left: s(62),
      height: s(24),
      width: s(24),
      borderRadius: s(12),
      backgroundColor: colors[theme].primary,
    },
  });

export default FriendGroupComponent;
