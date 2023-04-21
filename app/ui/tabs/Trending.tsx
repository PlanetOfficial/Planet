import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {s} from 'react-native-size-matters';
import {genres} from '../../constants/genres';
import PlaceCard from '../components/PlaceCard';
import Geolocation from '@react-native-community/geolocation';
import { floats, integers } from '../../constants/numbers';
import { requestLocations } from '../../utils/api/CreateCalls/requestLocations';

const Trending = ({navigation}: {navigation: any}) => {
  const [latitude, setLatitude] = useState(floats.defaultLatitude);
  const [longitude, setLongitude] = useState(floats.defaultLongitude);
  const [radius, setRadius] = useState(floats.defaultRadius);
  const [eventsData, setEventsData]: [any, any] = useState([]);

  useEffect(() => {
    const detectLocation = async () => {
      if (Platform.OS === 'ios') {
        Geolocation.requestAuthorization();
      } else if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted.');
          } else {
            console.log('Location permission denied.');
          }
        } catch (err) {
          console.warn(err);
        }
      }

      Geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error: any) => {
          console.log(error);
        },
      );
    };

    const loadTrending = async () => {
      await detectLocation();

      const categoryIds = genres[0].categories.map(category => category.id);

      const liveEventData = await requestLocations(
        categoryIds,
        radius,
        latitude,
        longitude,
        integers.defaultNumPlaces,
      );

      setEventsData(liveEventData);
    };

    loadTrending();
  }, [latitude, longitude]);

  return (
    <SafeAreaView testID="trendingScreenView" style={styles.container}>
      <View style={headerStyles.container}>
        <View style={headerStyles.titles}>
          <Text style={headerStyles.title}>{strings.title.trending}</Text>
          <Text style={headerStyles.in}>{strings.trending.in}</Text>
          <TouchableOpacity
            style={headerStyles.fgSelector}
            onPress={() => console.log('Switch location')}>
            <Text numberOfLines={1} style={headerStyles.location}>
              Seattle
            </Text>
            <View style={headerStyles.drop}>
              <Image style={[headerStyles.icon]} source={icons.next} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => console.log("Search doesn't work :DDDD")}>
          <Image style={headerStyles.search} source={icons.search} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {genres[0].categories.map((category, idx: number) => (
          <View key={idx} style={categoryStyles.container}>
            <View style={categoryStyles.header}>
              <Text style={categoryStyles.title}>{category.name}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('LiveCategory')}>
                <Text style={categoryStyles.seeAll}>
                  {strings.trending.seeAll}
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              contentContainerStyle={categoryStyles.contentContainer}
              style={categoryStyles.scrollView}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {eventsData[category.id] ? eventsData[category.id].map((item: any, jdx: number) => (
                <TouchableOpacity
                  style={categoryStyles.card}
                  key={jdx}
                  onPress={() => navigation.navigate('Place', {
                    destination: item,
                    category: item?.category?.name,
                  })}>
                  <PlaceCard
                    id={item?.id}
                    name={item?.name}
                    info={item?.date}
                    marked={item?.marked}
                    image={{uri: item?.image_url}}
                  />
                </TouchableOpacity>
              )) : null}
            </ScrollView>
            {idx === genres[0].categories.length - 1 ? (
              <View style={styles.bottomPadding} />
            ) : (
              <Spacer />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginLeft: s(20),
    marginTop: s(15),
  },
  bottomPadding: {
    height: s(20),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: s(20),
    marginVertical: s(15),
  },
  titles: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontSize: s(22),
    fontWeight: '700',
    color: colors.black,
  },
  in: {
    fontSize: s(20),
    fontWeight: '700',
    color: colors.darkgrey,
    marginHorizontal: s(6),
  },
  location: {
    fontSize: s(22),
    fontWeight: '700',
    color: colors.accent,
  },
  search: {
    width: s(20),
    height: s(20),
    tintColor: colors.black,
  },
  fgSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(6),
    width: s(12),
    height: s(8),
  },
  icon: {
    width: s(8),
    height: s(12),
    tintColor: colors.black,
    transform: [{rotate: '90deg'}],
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    marginTop: s(15),
  },
  header: {
    marginHorizontal: s(20),
    marginBottom: s(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  seeAll: {
    fontSize: s(12),
    fontWeight: '700',
    color: colors.accent,
  },
  card: {
    width: s(225),
    marginRight: s(10),
  },
  scrollView: {
    overflow: 'visible',
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
  },
});

export default Trending;
