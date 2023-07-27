import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  useColorScheme,
  StatusBar,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';

const LocationsSettings = ({navigation}: {navigation: any}) => {
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
          <View style={STYLES.texts}>
            <Text size="l">{strings.settings.locations}</Text>
          </View>
        </View>
      </SafeAreaView>
      <TouchableOpacity
        style={STYLES.settingsRow}
        onPress={Linking.openSettings}>
        <Text weight="l">{strings.settings.openLocationSettings}</Text>
        <Icon icon={icons.next} />
      </TouchableOpacity>
      <Separator />
    </View>
  );
};

export default LocationsSettings;
