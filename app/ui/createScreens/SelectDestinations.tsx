import React, {useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {s, vs} from 'react-native-size-matters';

import Place from '../components/Place';

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';

import {Category} from '../../utils/interfaces/category';
import {MarkerObject} from '../../utils/interfaces/MarkerObject';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';

const SelectDestinations = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [latitude] = useState(route?.params?.latitude);
  const [longitude] = useState(route?.params?.longitude);
  const [radius] = useState(route?.params?.radius);
  const [categories] = useState(route?.params?.selectedCategories);

  // gets all locations from selectedCategories
  const [locations, setLocations] = useState({});
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
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

    const filteredCategories = categories?.map((item: any) => item?.id);
    loadDestinations(filteredCategories);

    loadBookmarks();
  }, [latitude, longitude, radius, categories]);

  const getImage = (/*imagesData: Array<number>*/) => {
    // TODO: if there are images provided by API, then return one of those images instead

    return icons.x;
  };

  const handleDestinationSelect = (destination: any) => {
    if (
      !selectedDestinations?.find((item: any) => item?.id === destination?.id)
    ) {
      setSelectedDestinations(prevDestinations => [
        ...prevDestinations,
        destination,
      ]);
    } else {
      setSelectedDestinations(
        selectedDestinations?.filter(
          (item: any) => item?.id !== destination?.id,
        ),
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
    <SafeAreaView style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.back}
          onPress={() => navigation.navigate('SelectCategories')}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>
          {strings.createTabStack.selectDestinations}
        </Text>
        <TouchableOpacity style={headerStyles.confirm} onPress={handleDone}>
          <Image style={headerStyles.icon} source={icons.confirm} />
        </TouchableOpacity>
      </View>
      <View style={destStyles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* TODO: Need to display something when no results are found */}
          {categories
            ? categories?.map((category: Category) => (
                <View key={category?.id}>
                  <View style={destStyles.header}>
                    <Image style={destStyles.icon} source={icons.settings} />
                    <Text style={destStyles.name}>{category?.name}</Text>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {locations && locations[category?.id]
                      ? locations[category?.id]?.map((dest: any) => (
                          <View
                            testID={`destination.${category?.id}.${dest?.id}`}
                            key={dest?.id}>
                            <TouchableOpacity
                              onPress={() => handleDestinationSelect(dest)}
                              onLongPress={() =>
                                navigation.navigate('DestinationDetails', {
                                  destination: dest,
                                  category: category?.name,
                                })
                              }>
                              <Place
                                id={dest?.id}
                                name={dest?.name}
                                info={`Rating: ${dest?.rating}/10  Price: ${dest?.price}/5`}
                                marked={bookmarks?.includes(dest?.id)}
                                image={getImage(dest?.images)}
                                selected={selectedDestinations?.some(
                                  item => item?.id === dest?.id,
                                )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  back: {
    marginRight: s(20 / 3),
    width: s(40 / 3),
    height: s(20),
  },
  confirm: {
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const destStyles = StyleSheet.create({
  container: {
    marginTop: vs(10),
    width: '100%',
    height: vs(590),
  },
  header: {
    marginTop: vs(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: s(25),
    height: s(40),
  },
  icon: {
    width: s(30),
    height: s(30),
    borderRadius: s(15),
    borderWidth: 2,
    tintColor: colors.black,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  name: {
    marginLeft: s(10),
    fontSize: s(20),
    fontWeight: '600',
    color: colors.black,
  },
});

export default SelectDestinations;
