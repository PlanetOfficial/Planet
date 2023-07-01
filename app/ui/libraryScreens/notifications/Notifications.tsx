import React from 'react';
import {View, SafeAreaView, useColorScheme} from 'react-native';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

// TODO: INCOMPLETE
const Notifications = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.notifications.notifications}</Text>
          <Icon
            icon={icons.settings}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('NotificationSettings')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Notifications;
