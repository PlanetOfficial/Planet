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
import EncryptedStorage from 'react-native-encrypted-storage';
import {icons, miscIcons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {s, vs} from 'react-native-size-matters';

import DestinationCard from '../../components/Destination';

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';

import {Category} from '../../utils/interfaces/category';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';

const SelectDestinations = ({navigation, route}: {navigation: any, route: any}) => {
  const [latitude, setLatitude] = useState(route?.params?.latitude);
  const [longitude, setLongitude] = useState(route?.params?.longitude);
  const [radius, setRadius] = useState(route?.params?.radius);
  const [categories, setCategories] = useState(
    route?.params?.selectedCategories,
  );

  // gets all locations from selectedCategories
  const [locations, setLocations] = useState({});
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

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

  const loadBookmarks = async () => {
    const authToken = await EncryptedStorage.getItem('auth_token');
    const response = await getBookmarks(authToken);

    let bookmarksLoaded: Array<number> = [];
    response?.forEach((bookmark: any) => {
      bookmarksLoaded?.push(bookmark?.id);
    });

    setBookmarks(bookmarksLoaded);
  };

  useEffect(() => {
    const filteredCategories = categories?.map((item: any) => item?.id);
    loadDestinations(filteredCategories);

    loadBookmarks();
  }, []);

  const getImage = (imagesData: Array<number>) => {
    // TODO: if there are images provided by API, then return one of those images instead

    return icons.defaultImage;
  };

  const handleDestinationSelect = (destination: any) => {
    if (!selectedDestinations?.find((item: any) => item?.id === destination?.id)) {
      setSelectedDestinations(prevDestinations => [
        ...prevDestinations,
        destination,
      ]);
    } else {
      setSelectedDestinations(
        selectedDestinations?.filter(item => item?.id !== destination?.id),
      );
    }
  };

  const handleDone = () => {
    if (selectedDestinations?.length > 0) {
      let markers: Array<MarkerObject> = [];
      selectedDestinations?.forEach((destination: any) => {
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
    <View style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.back}
          onPress={() => navigation.navigate('SelectCategories')}>
          <Image style={headerStyles.icon} source={miscIcons.back} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>
          {strings.createTabStack.selectCategories}
        </Text>
      </View>
      <View>
        <ScrollView style={styles.destinationScrollView}>
          {categories
            ? categories?.map((category: Category) => (
                <View key={category?.id}>
                  <Text style={styles.categoryTitle}>{category?.name}</Text>
                  <ScrollView horizontal={true}>
                    {locations[category?.id]
                      ? locations[category?.id]?.map((destination: Object) => (
                          <View key={destination?.id}>
                            <TouchableOpacity
                              onPress={() =>
                                handleDestinationSelect(destination)
                              }
                              onLongPress={() =>
                                navigation.navigate('DestinationDetails', {
                                  destination: destination,
                                  category: category?.name,
                                })
                              }
                              style={{
                                backgroundColor: selectedDestinations?.some(
                                  item => item?.id === destination?.id,
                                )
                                  ? colors.accent
                                  : colors.white,
                              }}>
                              <DestinationCard
                                id={destination?.id}
                                name={destination?.name}
                                rating={destination?.rating}
                                price={destination?.price}
                                image={getImage(destination?.images)}
                                marked={bookmarks?.includes(destination?.id)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: colors.white,
  },
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

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(50),
    width: s(300),
    height: vs(20),
  },
  title: {
    position: 'absolute',
    left: s(25),
    width: s(250),
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  back: {
    left: 0,
    width: vs(12),
    height: vs(18),
  },
  confirm: {
    position: 'absolute',
    right: 0,
    width: vs(18),
    height: vs(18),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

export default SelectDestinations;
