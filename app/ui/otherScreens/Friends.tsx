import React from 'react';
import {View, SafeAreaView, Alert} from 'react-native';

import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

const Friends = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            icon={icons.back}
            size="m"
            onPress={() => navigation.goBack()}
          />
          <Text>{strings.friends.friends}</Text>
          <Icon
            icon={icons.add}
            size="l"
            onPress={() => Alert.alert('Add Friend', 'Coming soon!')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Friends;
