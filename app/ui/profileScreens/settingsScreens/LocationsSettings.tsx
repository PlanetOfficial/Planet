import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';

const LocationsSettings = ({navigation}: {navigation: any}) => {
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
        style={styles.row}
        onPress={() => Alert.alert('Primary Location is not implemented yet')}>
        <Text weight="l">Primary Location: Seattle</Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={styles.row} onPress={Linking.openSettings}>
        <Text weight="l">{strings.settings.openLocationSettings}</Text>
      </TouchableOpacity>
      <Separator />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(35),
    paddingVertical: s(20),
  },
});

export default LocationsSettings;
