import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';
import FriendsNavBar from '../navigation/FriendsNavBar';

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
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={localStyles.header}>
            <Text size="l">{strings.friends.friends}</Text>
          </View>
        </View>
      </SafeAreaView>

      <FriendsNavBar />
    </View>
  );
};

const localStyles = StyleSheet.create({
  header: {
    flex: 1,
    marginLeft: s(10),
  },
});

export default Friends;
