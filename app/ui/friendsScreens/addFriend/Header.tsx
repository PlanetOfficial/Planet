import React from 'react';
import {View, SafeAreaView, useColorScheme} from 'react-native';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

interface Props {
  navigation: any;
  isEvent: boolean;
}

const Header: React.FC<Props> = ({navigation, isEvent}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon
          icon={icons.close}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Text>
          {isEvent ? strings.friends.addFriends : strings.friends.inviteFriends}
        </Text>
        <Icon icon={icons.close} color="transparent" />
      </View>
    </SafeAreaView>
  );
};

export default Header;
