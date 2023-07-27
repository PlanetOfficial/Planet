import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Alert,
  ScrollView,
  useColorScheme,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {s} from 'react-native-size-matters';
import moment from 'moment';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import {getEvent} from '../../../utils/api/eventAPI';
import {postDestination} from '../../../utils/api/destinationAPI';
import {Destination, Event, EventDetail} from '../../../utils/types';

import Header from './Header';
import Info from './Info';
import Members from './Members';
import Destinations from './Destinations';
import {handleReportEvent} from './functions';

const EventSettings = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params: {
      event: Event;
      destination: Destination;
      category: string | undefined;
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
      setEventDetail(_eventDetail);
      setEventTitle(_eventDetail.name);
      if (_eventDetail.datetime) {
        setDatetime(moment(_eventDetail.datetime).format('MMM Do, h:mm a'));
      }
    } else {
      Alert.alert(strings.error.error, strings.error.fetchEvent);
    }
  }, [event.id]);

  const addDestination = useCallback(async () => {
    const destination = route.params.destination;

    if (destination) {
      const response = await postDestination(
        event.id,
        destination.id,
        route.params?.category || strings.event.destinationDefaultName,
      );

      if (response) {
        loadData();
      } else {
        Alert.alert(strings.error.error, strings.error.addSuggestion);
      }

      navigation.setParams({destination: undefined});
    }
  }, [event.id, loadData, navigation, route.params]);

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

      <ScrollView scrollIndicatorInsets={{right: 1}}>
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
        <TouchableOpacity
          style={styles.report}
          onPress={() => handleReportEvent(event.id)}>
          <Text size="s" weight="l" color={colors[theme].neutral}>
            {strings.event.reportEvent}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  report: {
    marginTop: s(30),
    alignSelf: 'center',
  },
});

export default EventSettings;
