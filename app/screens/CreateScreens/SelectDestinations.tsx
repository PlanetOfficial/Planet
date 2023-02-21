import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
} from 'react-native';
import images from '../../constants/Images';
import strings from '../../constants/strings';

import { requestLocations } from '../../utils/api/CreateCalls/requestLocations';

const SelectDestinations = ({navigation, route}) => {
  const [latitude, setLatitude] = useState(route?.params?.latitude);
  const [longitude, setLongitude] = useState(route?.params?.longitude);
  const [radius, setRadius] = useState(route?.params?.radius);
  const [categories, setCategories] = useState(route?.params?.selectedCategories);

  const [locations, setLocations] = useState({});

  const loadDestinations = async () => {
    const response = await requestLocations(categories, radius, latitude, longitude, 5);
    setLocations(response);
  }

  useEffect(() => {
    loadDestinations();
  }, [])

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('SelectGenres')}>
            <Image source={images.BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {strings.createTabStack.selectDestinations}
          </Text>
          <View />
        </View>
      </View>
      <View>
        <Button
          title={strings.main.done}
          onPress={() => navigation.navigate('FinalizePlan')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
  },
});

export default SelectDestinations;
