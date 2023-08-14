import React from 'react';
import {View, Alert, useColorScheme, SafeAreaView} from 'react-native';
import prompt from 'react-native-prompt-android';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {useFriendsContext} from '../../../context/FriendsContext';

import {createFG} from './functions';

interface Props {
  navigation: any;
  selectedId: number[];
}

const Header: React.FC<Props> = ({navigation, selectedId}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  const {setFriendGroups} = useFriendsContext();

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon
          icon={icons.close}
          onPress={() => {
            if (selectedId.length > 0) {
              Alert.alert(
                strings.main.warning,
                strings.friends.fgCreateBackConfirmation,
                [
                  {
                    text: strings.main.cancel,
                    style: 'cancel',
                  },
                  {
                    text: strings.main.discard,
                    onPress: () => navigation.goBack(),
                    style: 'destructive',
                  },
                ],
              );
            } else {
              navigation.goBack();
            }
          }}
        />
        <Text>{'  ' + strings.friends.createFriendGroup}</Text>
        <Icon
          icon={icons.check}
          size="m"
          color={
            selectedId.length > 0
              ? colors[theme].accent
              : colors[theme].secondary
          }
          disabled={selectedId.length === 0}
          onPress={() => {
            prompt(
              strings.friends.friendGroupName,
              strings.friends.friendGroupNameInfo,
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Save',
                  onPress: name => {
                    createFG(name, selectedId, setFriendGroups, navigation);
                  },
                },
              ],
              {},
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;
