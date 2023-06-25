import React from 'react';
import {View, SafeAreaView} from 'react-native';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

const ContactUs = ({navigation}: {navigation: any}) => {
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
            <Text size="l">{strings.settings.contactUs}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ContactUs;
