import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Keyboard,
  ScrollView,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../../constants/colors';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Text from '../../components/Text';

import BookmarkContext from '../../../context/BookmarkContext';

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
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [eventTitle, setEventTitle] = useState<string>('');
  const [date, setDate] = useState<string>();
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [destinations, setDestinations] = useState<Poi[]>([]);
  const [insertionIndex, setInsertionIndex] = useState<number>(0);

  const bookmarkContext = useContext(BookmarkContext);
  if (!bookmarkContext) {
    throw new Error('BookmarkContext is not set!');
  }
  const {bookmarks, setBookmarks} = bookmarkContext;

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

  return (
    <View style={STYLES.container}>
      {eventTitle !== undefined ? (
        <Header
          navigation={navigation}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          date={date}
          setDate={setDate}
          members={members}
          destinations={destinations}
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
        <ScrollView onTouchStart={() => Keyboard.dismiss()}>
          <TouchableOpacity
            style={[styles.addButton, STYLES.shadow]}
            onPress={() => {
              setInsertionIndex(0);
              navigation.navigate('ModeSearch', {
                mode: 'create',
              });
            }}>
            <Text size="l" weight="b" color={colors[theme].accent}>
              {strings.event.addDestination}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {eventTitle ? (
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

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    addButton: {
      alignItems: 'center',
      marginTop: s(30),
      marginHorizontal: s(40),
      paddingVertical: s(20),
      borderRadius: s(10),
      backgroundColor: colors[theme].primary,
    },
  });

export default Create;
