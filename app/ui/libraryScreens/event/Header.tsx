import React from 'react';
import {
  View,
  SafeAreaView,
  useColorScheme,
  TouchableOpacity,
  Alert,
} from 'react-native';
import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {Event, EventDetail} from '../../../utils/types';
import {onSharePress, onStatusChange} from './functions';

interface Props {
  navigation: any;
  event: Event;
  setEvent: (event: Event) => void;
  eventDetail: EventDetail | undefined;
  displayingSuggestion: boolean;
  onSuggestionClose: () => void;
}

const Header: React.FC<Props> = ({
  navigation,
  event,
  setEvent,
  eventDetail,
  displayingSuggestion,
  onSuggestionClose,
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);

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
          {event.datetime || eventDetail?.datetime ? (
            <Text size="xs" weight="l" color={colors[theme].accent}>
              {moment(
                eventDetail ? eventDetail.datetime : event.datetime,
              ).format('MMM Do, h:mm a')}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  event.completed
                    ? strings.event.markAsIncomplete
                    : strings.event.markAsCompleted,
                  strings.event.changeCompletionStatusInfo,
                  [
                    {
                      text: strings.main.cancel,
                      style: 'cancel',
                    },
                    {
                      text: strings.main.confirm,
                      onPress: () => onStatusChange(event, setEvent),
                    },
                  ],
                )
              }>
              <Text size="xs" color={colors[theme].accent}>
                {event.completed
                  ? strings.event.completed
                  : strings.event.incomplete}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={STYLES.icon}>
          <Icon
            icon={icons.share}
            disabled={displayingSuggestion}
            button={true}
            padding={-4}
            onPress={
              displayingSuggestion
                ? onSuggestionClose
                : () => onSharePress(event)
            }
          />
        </View>
        <View style={STYLES.icon}>
          <Icon
            icon={icons.chat}
            disabled={displayingSuggestion}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('EventChat', {event})}
          />
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
