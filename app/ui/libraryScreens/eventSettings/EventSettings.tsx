import React, {useCallback, useEffect, useState} from 'react';
import {View, Alert, ScrollView, useColorScheme, StatusBar} from 'react-native';
import moment from 'moment';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import {getEvent} from '../../../utils/api/eventAPI';
import {postDestination} from '../../../utils/api/destinationAPI';
import {Destination, Event, EventDetail} from '../../../utils/types';

import Header from './Header';
import Info from './Info';
import Members from './Members';
import Destinations from './Destinations';

const EventSettings = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      event: Event;
      destination: Destination;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [event] = useState<Event>(route.params.event);
  const [eventDetail, setEventDetail] = useState<EventDetail>();

  const [eventTitle, setEventTitle] = useState<string>();
  const [datetime, setDatetime] = useState<string>();

  const loadData = useCallback(async () => {
    const _eventDetail = await getEvent(event.id);
    if (_eventDetail) {
      const date = new Date();

      setEventDetail(_eventDetail);
      setEventTitle(_eventDetail.name);
      if (_eventDetail.datetime) {
        setDatetime(
          moment(_eventDetail.datetime)
            .add(date.getTimezoneOffset(), 'minutes')
            .format('MMM Do, h:mm a'),
        );
      }
    } else {
      Alert.alert(strings.error.error, strings.error.fetchEvent);
    }
  }, [event.id]);

  const addDestination = useCallback(async () => {
    const destination = route.params.destination;

    if (destination) {
      const response = await postDestination(event.id, destination.id);

      if (response) {
        loadData();
      } else {
        Alert.alert(strings.error.error, strings.error.addSuggestion);
      }

      navigation.setParams({destination: undefined});
    }
  }, [event.id, loadData, navigation, route.params.destination]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
      addDestination();
    });

    return unsubscribe;
  }, [navigation, loadData, addDestination]);

  return (
    <View style={STYLES.container}>
      <Header navigation={navigation} eventId={event.id} />

      <ScrollView>
        <Info
          event={event}
          eventDetail={eventDetail}
          setEventDetail={setEventDetail}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          datetime={datetime}
          setDatetime={setDatetime}
        />
        {eventDetail ? (
          <>
            <Members
              navigation={navigation}
              event={event}
              eventDetail={eventDetail}
            />
            <Destinations
              navigation={navigation}
              event={event}
              eventDetail={eventDetail}
              setEventDetail={setEventDetail}
              loadData={loadData}
            />
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default EventSettings;
