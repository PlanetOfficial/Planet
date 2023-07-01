import React from 'react';
import {View, SafeAreaView, useColorScheme} from 'react-native';

import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import ProfileBody from './ProfileBody';

const Profile = ({navigation}: {navigation: any}) => {
  return (
    <View style={STYLES.container}>
      <SafeAreaView>
        <View style={STYLES.header}>
          <Text size="l">{strings.profile.yourProfile}</Text>
          <Icon
            icon={icons.settings}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </SafeAreaView>
      <ProfileBody navigation={navigation} />
    </View>
  );
};

export default Profile;
