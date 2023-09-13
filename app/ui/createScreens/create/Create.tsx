import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  useColorScheme,
  StatusBar,
  Keyboard,
  ScrollView,
} from 'react-native';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';
import STYLING from '../../../constants/styles';

import Icon from '../../components/Icon';
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
      members: UserInfo[] | undefined;
      destination: Poi | undefined;
      category: string | undefined;
      destinations: Poi[] | undefined;
      names: string[] | undefined;
    };
  };
}) => {
  const theme = useColorScheme() || 'light';
  const STYLES = STYLING(theme);
  StatusBar.setBarStyle(colors[theme].statusBar, true);

  const [eventTitle, setEventTitle] = useState<string>('');
  const [date, setDate] = useState<string>();
  const [members, setMembers] = useState<UserInfo[]>([]);
  const [destinations, setDestinations] = useState<Poi[]>([]);
  const [insertionIndex, setInsertionIndex] = useState<number>(0);
  const [destinationNames, setDestinationNames] = useState<Map<number, string>>(
    new Map(),
  );

  const addMembers = useCallback(() => {
    const _members = route.params?.members;

    if (_members) {
      setMembers(_members);

      navigation.setParams({member: undefined});
    }
  }, [navigation, route.params?.members]);

  const addDestination = useCallback(() => {
    const destination = route.params?.destination;

    if (destination) {
      const _destinations = destinations ? [...destinations] : [];
      _destinations.splice(insertionIndex, 0, destination);
      setDestinations(_destinations);

      const _destinationNames = new Map(destinationNames);
      _destinationNames.set(
        destination.id,
        route.params?.category || strings.event.destinationDefaultName,
      );
      setDestinationNames(_destinationNames);

      navigation.setParams({destination: undefined});
    }
  }, [
    navigation,
    route.params,
    destinations,
    insertionIndex,
    destinationNames,
  ]);

  const initializeDestinations = useCallback(() => {
    const _destinations = route.params?.destinations;
    const _names = route.params?.names;

    if (_destinations && _names) {
      setDestinations(_destinations);
      const _destinationNames = new Map(destinationNames);
      for (let i = 0; i < _destinations.length; i++) {
        _destinationNames.set(_destinations[i].id, _names[i]);
      }
      setDestinationNames(_destinationNames);

      navigation.setParams({destinations: undefined, names: undefined});
    }
  }, [
    navigation,
    route.params?.destinations,
    route.params?.names,
    destinationNames,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      addMembers();
      addDestination();
      initializeDestinations();
    });

    return unsubscribe;
  }, [navigation, addMembers, addDestination, initializeDestinations]);

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
          setInsertionIndex={setInsertionIndex}
          destinationNames={destinationNames}
        />
      ) : (
        <ScrollView
          scrollIndicatorInsets={{right: 1}}
          onTouchStart={() => Keyboard.dismiss()}>
          <TouchableOpacity
            style={[STYLES.actionButton, STYLES.shadow]}
            onPress={() => {
              setInsertionIndex(0);
              navigation.navigate('ModeExplore', {
                mode: 'create',
              });
            }}>
            <View style={STYLES.icon}>
              <Icon icon={icons.plus} color={colors[theme].primary} />
            </View>
            <Text color={colors[theme].primary}>
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
          destinationNames={destinationNames}
        />
      ) : null}
    </View>
  );
};

export default Create;
