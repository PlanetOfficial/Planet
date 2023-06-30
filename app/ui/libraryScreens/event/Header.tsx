import React from 'react';
import {View, SafeAreaView} from 'react-native';
import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Event, EventDetail} from '../../../utils/types';

interface Props {
  navigation: any;
  event: Event;
  eventDetail: EventDetail | undefined;
  displayingSuggestion: boolean;
  onSuggestionClose: () => void;
}

const Header: React.FC<Props> = ({
  navigation,
  event,
  eventDetail,
  displayingSuggestion,
  onSuggestionClose,
}) => {
  const date = new Date();

  return (
    <SafeAreaView onTouchStart={onSuggestionClose}>
      <View style={STYLES.header}>
        <Icon
          size="m"
          icon={icons.back}
          disabled={displayingSuggestion}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <View style={STYLES.texts}>
          <Text>{eventDetail ? eventDetail.name : event.name}</Text>
          <Text size="xs" weight="l" color={colors.primary}>
            {moment(eventDetail ? eventDetail.datetime : event.datetime)
              .add(date.getTimezoneOffset(), 'minutes')
              .format('MMM Do, h:mm a')}
          </Text>
        </View>
        <Icon
          icon={icons.more}
          disabled={displayingSuggestion}
          button={true}
          padding={-2}
          onPress={() => navigation.navigate('EventSettings', {event})}
        />
      </View>
    </SafeAreaView>
  );
};

export default Header;
