import React from 'react';
import {
  View,
  SafeAreaView,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';

const PrivacySettings = ({navigation}: {navigation: any}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text size="l">{strings.settings.privacy}</Text>
          <Icon size="m" icon={icons.back} color="transparent" />
        </View>
      </SafeAreaView>
      <TouchableOpacity
        style={STYLES.settingsRow}
        onPress={() => navigation.navigate('BlockedUsers')}>
        <Text weight="l">{strings.settings.blockedUsers}</Text>
        <Icon icon={icons.next} />
      </TouchableOpacity>
      <Separator />
    </View>
  );
};

export default PrivacySettings;
