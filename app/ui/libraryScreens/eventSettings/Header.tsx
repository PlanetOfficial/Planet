import React from 'react';
import {View, SafeAreaView, Alert, useColorScheme} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';

import {leaveEvent} from '../../../utils/api/eventAPI';
import OptionMenu from '../../components/OptionMenu';
import {handleReportEvent} from './functions';

interface Props {
  navigation: any;
  eventId: number;
}

const Header: React.FC<Props> = ({navigation, eventId}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

  const handleLeave = async () => {
    const response = await leaveEvent(eventId);

    if (response) {
      navigation.navigate(strings.title.library);
    } else {
      Alert.alert(strings.error.error, strings.error.leaveEvent);
    }
  };

  return (
    <SafeAreaView>
      <View style={STYLES.header}>
        <Icon size="m" icon={icons.back} onPress={() => navigation.goBack()} />
        <OptionMenu
          options={[
            {
              name: strings.event.report,
              onPress: () => handleReportEvent(eventId),
              color: colors[theme].neutral,
            },
            {
              name: strings.event.leave,
              onPress: () => {
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
              },
              color: colors[theme].red,
            },
          ]}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;
