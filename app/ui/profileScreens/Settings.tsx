import React from 'react';
import {View, SafeAreaView, Alert} from 'react-native';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

const Settings = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.profile.settings}</Text>
          <Icon
            size="l"
            color={colors.accent}
            icon={icons.add}
            onPress={() => Alert.alert('Add Friend', 'Coming soon!')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Settings;
