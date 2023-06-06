import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Icon from '../components/Icon';
import Separator from '../components/Separator';

import {Poi} from '../../utils/types';
import PoiCard from '../components/PoiCard';

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
      <FlatList
        data={temp_data}
        renderItem={({item}) => (
          <View style={homeStyles.container}>
            <View style={homeStyles.header}>
              <Text>{item.name}</Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={homeStyles.scrollView}>
              {item.pois.map((poi: Poi) => (
                <TouchableOpacity
                  key={poi.id}
                  style={homeStyles.cardContainer}
                  onPress={() => {
                    Alert.alert('Coming soon!', 'This feature is coming soon!');
                  }}>
                  <PoiCard poi={poi} bookmarked={false} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        ItemSeparatorComponent={Separator}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    paddingVertical: s(10),
  },
  header: {
    paddingHorizontal: s(20),
    paddingTop: s(5),
    paddingBottom: s(10),
  },
  scrollView: {
    paddingLeft: s(20),
    paddingVertical: s(5),
  },
  cardContainer: {
    marginRight: s(15),
    overflow: 'visible',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: colors.white,
  },
  icon: {
    width: '60%',
    height: '60%',
  },
});

const temp_data = [
  {
    id: 1,
    name: 'Popular in Seattle',
    pois: [
      {
        id: 1,
        supplier: 'whoknows',
        name: 'Poi 1',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 3,
        rating: 4.5,
        rating_count: 10000,
        category_name: 'Category 1',
      },
      {
        id: 2,
        supplier: 'whoknows',
        name: 'Poi 2',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 4,
        rating: 4.5,
        rating_count: 10000,
        category_name: 'Category 1',
      },
      {
        id: 3,
        supplier: 'whoknows',
        name: 'Poi 3',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 4,
        rating: 4.5,
        rating_count: 10000,
        category_name: 'Category 1',
      },
    ],
  },
  {
    id: 2,
    name: 'Not Popular in Seattle',
    pois: [
      {
        id: 1,
        supplier: 'whoknows',
        name: 'Local Point',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 2,
        rating: 4.3,
        rating_count: 10000,
        category_name: 'Ass',
      },
      {
        id: 2,
        supplier: 'whoknows',
        name: 'Center Table',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 4,
        rating: 4.5,
        rating_count: 32400,
        category_name: 'Category 1',
      },
      {
        id: 3,
        supplier: 'whoknows',
        name: 'Poi 3',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 5,
        rating: 4.5,
        rating_count: 100,
        category_name: 'Category 1',
      },
    ],
  },
  {
    id: 3,
    name: 'Kinda Popular in Seattle',
    pois: [
      {
        id: 1,
        supplier: 'whoknows',
        name: 'Local Point',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 2,
        rating: 4.3,
        rating_count: 10000,
        category_name: 'Ass',
      },
      {
        id: 2,
        supplier: 'whoknows',
        name: 'Center Table',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 4,
        rating: 4.5,
        rating_count: 32400,
        category_name: 'Category 1',
      },
      {
        id: 3,
        supplier: 'whoknows',
        name: 'Poi 3',
        photo: 'https://picsum.photos/200',
        place_id: '123',
        latitude: 0,
        longitude: 0,
        vicinity: '123 Main St',
        price: 5,
        rating: 4.5,
        rating_count: 100,
        category_name: 'Category 1',
      },
    ],
  },
];

export default Home;
