import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Alert, TouchableOpacity} from 'react-native';
import {s} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';

import moment from 'moment';

import colors from '../../../constants/colors';
import numbers from '../../../constants/numbers';
import strings from '../../../constants/strings';
import STYLES from '../../../constants/styles';

import Text from '../../components/Text';

import {Poi, UserInfo} from '../../../utils/types';

import Header from './Header';
import SaveButton from './SaveButton';
import DestinationsList from './DestinationsList';

const Create = ({
  navigation,
  route,
}: {
  navigation: any;
  route: {
    params?: {
      members?: UserInfo[];
      destination?: Poi;
    };
  };
}) => {
  const [eventTitle, setEventTitle] = useState<string>();
  const [date, setDate] = useState<string>();
  const [bookmarks, setBookmarks] = useState<Poi[]>([]);
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [destinations, setDestinations] = useState<Poi[]>([]);
  const [insertionIndex, setInsertionIndex] = useState<number>(0);

  const addMembers = useCallback(() => {
    const membersToBeAdded = route.params?.members;

    if (membersToBeAdded) {
      const _members = [...members];
      membersToBeAdded.forEach((member: UserInfo) => {
        if (!_members.includes(member)) {
          _members.push(member);
        }
      });
      setMembers(_members);

      navigation.setParams({member: undefined});
    }
  }, [navigation, route.params?.members, members]);

  const addDestination = useCallback(() => {
    const destination = route.params?.destination;

    if (destination) {
      const _destinations = destinations ? [...destinations] : [];
      _destinations.splice(insertionIndex, 0, destination);
      setDestinations(_destinations);

      navigation.setParams({destination: undefined});
    }
  }, [navigation, route.params?.destination, destinations, insertionIndex]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      addMembers();
      addDestination();
    });

    return unsubscribe;
  }, [navigation, addMembers, addDestination]);

  const initializeData = useCallback(async () => {
    const d = new Date();
    setEventTitle(strings.event.untitled);
    setDate(
      moment(
        new Date(
          Math.ceil(d.getTime() / numbers.fiveMinutes) * numbers.fiveMinutes,
        ),
      ).format('MMM Do, h:mm a'),
    );

    const _bookmarks = await AsyncStorage.getItem('bookmarks');
    if (_bookmarks) {
      setBookmarks(JSON.parse(_bookmarks));
    } else {
      Alert.alert(strings.error.error, strings.error.loadBookmarks);
    }
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <View style={STYLES.container}>
      {eventTitle !== undefined && date ? (
        <Header
          navigation={navigation}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          date={date}
          setDate={setDate}
          members={members}
        />
      ) : null}
      {destinations && destinations.length > 0 ? (
        <DestinationsList
          navigation={navigation}
          destinations={destinations}
          setDestinations={setDestinations}
          bookmarks={bookmarks}
          setBookmarks={setBookmarks}
          setInsertionIndex={setInsertionIndex}
        />
      ) : (
        <TouchableOpacity
          style={[styles.addButton, STYLES.shadow]}
          onPress={() => {
            setInsertionIndex(0);
            navigation.navigate('CreateSearch');
          }}>
          <Text size="l" weight="b" color={colors.accent}>
            {strings.event.addDestination}
          </Text>
        </TouchableOpacity>
      )}
      {eventTitle && date ? (
        <SaveButton
          navigation={navigation}
          eventTitle={eventTitle}
          date={date}
          members={members}
          destinations={destinations}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    marginTop: s(30),
    marginHorizontal: s(40),
    paddingVertical: s(20),
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
});

export default Create;