import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Alert,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import icons from '../../constants/icons';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import {Event} from '../../utils/types';
import {editDatetime, editName, getEvent} from '../../utils/api/eventAPI';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';
import colors from '../../constants/colors';
import { s } from 'react-native-size-matters';

const EventSettings = ({navigation, route}: {navigation: any; route: any}) => {
  const date = new Date();

  const [event] = useState<Event>(route.params.event);
  const [eventDetail, setEventDetail] = useState<any>(null);

  const [eventTitle, setEventTitle] = useState<string>(event.name);

  const [datetime, setDatetime] = useState<string>(
    moment(event.datetime)
      .add(date.getTimezoneOffset(), 'minutes')
      .format('MMM Do, h:mm a'),
  );
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    const _eventDetail = await getEvent(event.id);
    if (_eventDetail) {
      setEventDetail(_eventDetail);
    } else {
      Alert.alert('Error', 'Could not fetch event, please try again.');
    }
  }, [event.id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation, loadData]);

  const handleEditName = async () => {
    const response = await editName(event.id, eventTitle);

    if (response) {
      const _eventDetail = {...eventDetail};
      _eventDetail.name = eventTitle;
      setEventDetail(_eventDetail);
    } else {
      setEventTitle(event.name);
      Alert.alert('Error', 'Could not edit event name, please try again.');
    }
  };

  const handleEditDate = async (dt: string) => {
    const response = await editDatetime(event.id, dt);

    if (response) {
      const _eventDetail = {...eventDetail};
      _eventDetail.datetime = dt;
      setEventDetail(_eventDetail);
      setDatetime(dt);
    } else {
      setDatetime(event.datetime);
      Alert.alert('Error', 'Could not edit event date, please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            size="m"
            icon={icons.back}
            onPress={() => navigation.goBack()}
          />
        </View>
      </SafeAreaView>
      <View style={localStyles.texts}>
        <TextInput
          style={localStyles.title}
          value={eventTitle}
          autoCorrect={false}
          onChangeText={(text: string) => setEventTitle(text)}
          onEndEditing={async () => {
            if (eventTitle !== event.name) {
              handleEditName();
            }
          }}
        />
        <TouchableOpacity onPress={() => setDatePickerOpen(true)}>
          <Text size='s' weight="l" color={colors.darkgrey}>
            {datetime}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          open={datePickerOpen}
          minuteInterval={5}
          date={moment(datetime, 'MMM Do, h:mm a').toDate()}
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
    </View>
  );
};

const localStyles = StyleSheet.create({
  texts: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: s(10),
  },
  title: {
    fontSize: s(19),
    fontWeight: '700',
    fontFamily: 'Lato',
    marginBottom: s(10),
  },
});

export default EventSettings;
