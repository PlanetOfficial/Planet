import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {s} from 'react-native-size-matters';

import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';

const ContactUs = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
          <View style={localStyles.title}>
            <Text size="l">{strings.settings.contactUs}</Text>
          </View>
        </View>
      </SafeAreaView>
      <View style={localStyles.container}>
        <Text>You thought you could contact us. Lol!</Text>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  title: {
    flex: 1,
    marginLeft: s(10),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactUs;
