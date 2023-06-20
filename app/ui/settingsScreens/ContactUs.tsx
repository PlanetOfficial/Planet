import React from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';

import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import {s} from 'react-native-size-matters';

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
            <Text size="xl">{strings.settings.contactUs}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  title: {
    flex: 1,
    marginLeft: s(10),
  },
});

export default ContactUs;
