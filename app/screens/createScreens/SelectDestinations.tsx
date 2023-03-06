import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  ScrollView,
} from 'react-native';
import images from '../../constants/icons';
import strings from '../../constants/strings';
import {colors} from '../../constants/colors';

import DestinationCard from '../../components/Destination';

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';

import {Category} from '../../utils/interfaces/Category';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';

const SelectDestinations = ({navigation, route}) => {
  const [latitude, setLatitude] = useState(route?.params?.latitude);
  const [longitude, setLongitude] = useState(route?.params?.longitude);
  const [radius, setRadius] = useState(route?.params?.radius);
  const [categories, setCategories] = useState(
    route?.params?.selectedCategories,
  );

  // gets all locations from selectedCategories
  const [locations, setLocations] = useState({});

  const [selectedDestinations, setSelectedDestinations] = useState([]);

  const loadDestinations = async (categoryIds: Array<number>) => {
    const response = await requestLocations(
      categoryIds,
      radius,
      latitude,
      longitude,
      5,
    );

    setLocations(response);
  };

  useEffect(() => {
    const filteredCategories = categories.map(item => item.id);

    loadDestinations(filteredCategories);
  }, []);

  const getImage = (imagesData: Array<number>) => {
    // TODO: if there are images provided by API, then return one of those images instead

    return images.experience;
  };

  const handleDestinationSelect = (destination: Object) => {
    if (!selectedDestinations.find(item => item.id === destination.id)) {
      setSelectedDestinations(prevDestinations => [
        ...prevDestinations,
        destination,
      ]);
    } else {
      setSelectedDestinations(
        selectedDestinations.filter(item => item.id !== destination.id),
      );
    }
  };

  const handleDone = () => {
    if (selectedDestinations?.length > 0) {
      let markers: Array<MarkerObject> = [];
      selectedDestinations.forEach(destination => {
        const markerObject = {
          name: destination?.name,
          latitude: destination?.latitude,
          longitude: destination?.longitude,
        };

        markers.push(markerObject);
      });

      navigation.navigate('FinalizePlan', {
        selectedDestinations,
        markers,
      });
    }
  };

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
        </View>
      </View>
      <View>
        <ScrollView style={styles.destinationScrollView}>
          {categories
            ? categories.map((category: Category) => (
                <View key={category.id}>
                  <Text style={styles.categoryTitle}>{category.name}</Text>
                  <ScrollView horizontal={true}>
                    {locations[category.id]
                      ? locations[category.id].map((destination: Object) => (
                          <View key={destination.id}>
                            <TouchableOpacity
                              onPress={() =>
                                handleDestinationSelect(destination)
                              }
                              onLongPress={() =>
                                navigation.navigate('DestinationDetails', {
                                  destination: destination,
                                  category: category.name,
                                })
                              }
                              style={{
                                backgroundColor: selectedDestinations.some(
                                  item => item.id === destination.id,
                                )
                                  ? colors.accent
                                  : colors.white,
                              }}>
                              <DestinationCard
                                name={destination.name}
                                rating={destination.rating}
                                price={destination.price}
                                image={getImage(destination.images)}
                              />
                            </TouchableOpacity>
                          </View>
                        ))
                      : null}
                  </ScrollView>
                </View>
              ))
            : null}
        </ScrollView>
      </View>
      <View>
        <Button title={strings.main.done} onPress={handleDone} />
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
  destinationScrollView: {
    height: '88%',
  },
  categoryTitle: {
    marginLeft: 10,
    fontSize: 20,
  },
});

export default SelectDestinations;
