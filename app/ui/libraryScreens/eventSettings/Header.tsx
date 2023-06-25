import React from 'react';
import {View, SafeAreaView, Alert, TouchableOpacity} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLES from '../../../constants/styles';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {leaveEvent} from '../../../utils/api/eventAPI';

interface Props {
  navigation: any;
  eventId: number;
}

const Header: React.FC<Props> = ({navigation, eventId}) => {
  const handleLeave = async () => {
    const response = await leaveEvent(eventId);

    if (response) {
      navigation.navigate('Library');
    } else {
      Alert.alert(strings.error.error, strings.error.leaveEvent);
    }
  };

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon size="m" icon={icons.back} onPress={() => navigation.goBack()} />
        <TouchableOpacity
          onPress={() => {
            Alert.alert(strings.event.leaveEvent, strings.event.leaveInfo, [
              {
                text: strings.main.cancel,
                style: 'cancel',
              },
              {
                text: strings.event.leave,
                onPress: handleLeave,
                style: 'destructive',
              },
            ]);
          }}>
          <Text size="m" color={colors.red}>
            {strings.event.leave}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Header;
