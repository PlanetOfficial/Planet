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
import misc from '../../constants/misc';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {s} from 'react-native-size-matters';

import Place from '../components/PlaceCard';

import {requestLocations} from '../../utils/api/CreateCalls/requestLocations';

import {Category} from '../../utils/interfaces/category';
import {getBookmarks} from '../../utils/api/shared/getBookmarks';
import {getMarkerArray} from '../../utils/functions/Misc';

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
  const [locations, setLocations]: [any, any] = useState({});
  const [selectedDestinations, setSelectedDestinations]: [any, any] = useState(
    [],
  );
  const [bookmarks, setBookmarks]: [any, any] = useState([]);

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

      let bookmarksLoaded: any = [];
      response?.forEach((bookmark: any) => {
        bookmarksLoaded?.push(bookmark?.id);
      });

      setBookmarks(bookmarksLoaded);
    };

    const filteredCategories = categories?.map((item: any) => item?.id);
    loadDestinations(filteredCategories);

    loadBookmarks();
  }, [latitude, longitude, radius, categories]);

  const handleDestinationSelect = (destination: any) => {
    if (
      !selectedDestinations?.find((item: any) => item?.id === destination?.id)
    ) {
      setSelectedDestinations((prevDestinations: any) => [
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
      let markers = getMarkerArray(selectedDestinations);

      navigation.navigate('FinalizePlan', {
        selectedDestinations,
        markers,
        bookmarks,
        categories,
      });
    }
  };

  return (
    <SafeAreaView
      testID="selectDestinationsScreenView"
      style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          testID="selectDestinationsScreenBack"
          style={headerStyles.back}
          onPress={() => navigation.navigate('SelectCategories')}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>
          {strings.createTabStack.selectDestinations}
        </Text>
        <TouchableOpacity
          testID="confirmDestinations"
          style={headerStyles.confirm}
          onPress={handleDone}>
          <Image style={headerStyles.icon} source={icons.confirm} />
        </TouchableOpacity>
      </View>
      <View style={destStyles.container}>
        <ScrollView
          testID="selectDestinationsMainScroll"
          showsVerticalScrollIndicator={false}>
          {categories
            ? categories?.map((category: Category) => (
                <View key={category?.id}>
                  <View style={destStyles.header}>
                    <Image style={destStyles.icon} source={icons.settings} />
                    <Text style={destStyles.name}>{category?.name}</Text>
                  </View>
                  <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    testID={`category.${category?.id}.scrollView`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={'fast'}
                    snapToInterval={s(325)}
                    snapToAlignment={'start'}
                    pagingEnabled>
                    {locations &&
                    locations[category?.id] &&
                    locations[category?.id].length > 0 ? (
                      locations[category?.id]?.map((dest: any) => (
                        <View
                          style={styles.card}
                          testID={`destination.${category?.id}.${dest?.id}`}
                          key={dest?.id}>
                          <TouchableOpacity
                            onPress={() => handleDestinationSelect(dest)}
                            onLongPress={() =>
                              navigation.navigate('Place', {
                                destination: dest,
                                category: category?.name,
                              })
                            }>
                            <Place
                              id={dest?.id}
                              name={dest?.name}
                              info={`${strings.createTabStack.rating}: ${dest?.rating}/10  ${strings.createTabStack.price}: ${dest?.price}/5`}
                              marked={bookmarks?.includes(dest?.id)}
                              image={
                                dest?.images && dest?.images?.length !== 0
                                  ? {
                                      uri:
                                        dest?.images[0]?.prefix +
                                        misc.imageSize +
                                        dest?.images[0]?.suffix,
                                    }
                                  : icons.defaultIcon
                              }
                              // selected={selectedDestinations?.some(
                              //   item => item?.id === dest?.id,
                              // )}
                            />
                          </TouchableOpacity>
                        </View>
                      ))
                    ) : (
                      <View style={styles.placeHolder}>
                        <Text style={styles.placeHolderText}>
                          {strings.createTabStack.noDestinations}
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                  <View style={styles.separator} />
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
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
  },
  card: {
    width: s(310),
    marginRight: s(15),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
    marginHorizontal: s(20),
  },
  placeHolder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(310),
    marginVertical: s(20),
  },
  placeHolderText: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
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
    marginTop: s(10),
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: s(20),
    paddingHorizontal: s(5),
    marginBottom: s(10),
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
