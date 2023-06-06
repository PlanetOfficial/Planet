import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  LayoutAnimation,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {s} from 'react-native-size-matters';
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import numbers from '../../constants/numbers';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import Separator from '../components/Separator';

import {Category, Coordinate, Genre} from '../../utils/types';

const Home = ({navigation}: {navigation: any}) => {
  const GetGreetings = () => {
    const myDate = new Date();
    const hours = myDate.getHours();

    if (hours < 12) {
      return strings.greeting.morning;
    } else if (hours >= 12 && hours <= 17) {
      return strings.greeting.afternoon;
    } else if (hours >= 17 && hours <= 24) {
      return strings.greeting.evening;
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Text size="l">{GetGreetings()}</Text>
          <Icon
            icon={icons.friends}
            button={true}
            padding={-2}
            onPress={() => navigation.navigate('Friends')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;
