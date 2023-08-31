import React, {useState} from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {s} from 'react-native-size-matters';
import prompt from 'react-native-prompt-android';
import moment from 'moment';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';

import Text from '../../components/Text';
import Icon from '../../components/Icon';

import {editDatetime, editName} from '../../../utils/api/eventAPI';
import {Event, EventDetail} from '../../../utils/types';

interface Props {
  event: Event;
  eventDetail: EventDetail | undefined;
  setEventDetail: (eventDetail: EventDetail) => void;
  eventTitle: string | undefined;
  setEventTitle: (eventTitle: string) => void;
  datetime: string | undefined;
  setDatetime: (datetime: string) => void;
}

const Info: React.FC<Props> = ({
  event,
  eventDetail,
  setEventDetail,
  eventTitle,
  setEventTitle,
  datetime,
  setDatetime,
}) => {
  const currentDate = new Date();

  const theme = useColorScheme() || 'light';

  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const handleEditName = async (name: string) => {
    if (!eventDetail) {
      return;
    }

    const response = await editName(event.id, name);

    if (response) {
      const _eventDetail = {...eventDetail};
      _eventDetail.name = name;
      setEventDetail(_eventDetail);
      setEventTitle(name);
    } else {
      Alert.alert(strings.error.error, strings.error.editEventName);
    }
  };

  const handleEditDate = async (dt: string) => {
    const response = await editDatetime(
      event.id,
      moment(dt, 'MMM Do, h:mm a').toString(),
    );

    if (response && eventDetail) {
      const _eventDetail = {...eventDetail};
      _eventDetail.datetime = dt;
      setEventDetail(_eventDetail);
      setDatetime(dt);
    } else {
      Alert.alert(strings.error.error, strings.error.editEventDate);
    }
  };

  return (
    <View style={styles.texts}>
      <TouchableOpacity
        style={styles.titleContainer}
        onPress={() =>
          prompt(
            strings.main.rename,
            strings.event.renameEvent,
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Save',
                onPress: (name: string) => handleEditName(name),
              },
            ],
            {
              defaultValue: eventTitle,
            },
          )
        }>
        <Text size="l">{eventTitle}</Text>
        <View style={styles.pencil}>
          <Icon icon={icons.edit} color={colors[theme].secondary} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
        <Text size="s" weight="l">
          {datetime ? datetime : strings.event.noDate}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={datePickerOpen}
        minuteInterval={5}
        date={
          datetime
            ? moment(datetime, 'MMM Do, h:mm a').toDate()
            : moment(
                new Date(
                  Math.ceil(currentDate.getTime() / numbers.fiveMinutes) *
                    numbers.fiveMinutes,
                ),
              ).toDate()
        }
        onConfirm={newDate => {
          setDatePickerOpen(false);
          handleEditDate(
            moment(newDate, 'YYYY-MM-DD HH:mm:ssZ').format('MMM Do, h:mm a'),
          );
        }}
        onCancel={() => {
          setDatePickerOpen(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  texts: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: s(10),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: s(10),
  },
  pencil: {
    marginLeft: s(5),
  },
});

export default Info;
