import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  SafeAreaView,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import {colors} from '../../constants/colors';
import {vectors, miscIcons} from '../../constants/images';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

// temporary
const PLACE_DATA = [
  {
    id: '1',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
    image: require('../../assets/sharetea.jpeg'),
  },
  {
    id: '2',
    name: 'Bellevue Art Museum',
    category: 'Art Exhibit',
    image: require('../../assets/sharetea.jpeg'),
  },
  {
    id: '3',
    name: "Mama's kitchen",
    category: 'Korean Restaurant',
    image: require('../../assets/sharetea.jpeg'),
  },
  {
    id: '4',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
    image: require('../../assets/sharetea.jpeg'),
  },
];

const EVENT_DATA = [
  {
    id: '1',
    name: "Leo's Nasty 19th Birthday",
    date: 'June 14th, 2023',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
  {
    id: '2',
    name: 'Donutter First Run',
    date: 'November 19th, 2022',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
  {
    id: '3',
    name: 'Anniversary Night Out',
    date: 'Feburary 2nd, 2024',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
  {
    id: '4',
    name: 'Saturdays are for the Boys',
    date: 'December 18th, 2026',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
];

const Library = () => {
  const [selectedIndex, setIndex] = useState(0);
  return (
    <View style={styles.container}>
      <Image style={styles.background} source={vectors.shape1}/>
      <Text style={styles.title}>Library</Text>
      <Image style={styles.search} source={miscIcons.search} />
      {SegmentedControl(selectedIndex, setIndex)}
      {selectedIndex == 0 ? Places() : Events()}
    </View>
  );
};

const SegmentedControl = (
  selectedIndex: number, 
  setIndex: React.Dispatch<React.SetStateAction<number>>
  ) => (
  <View style={styles.sctContainer}>
    <SegmentedControlTab
      tabsContainerStyle={sctStyles.container}
      tabStyle={sctStyles.tab}
      activeTabStyle={sctStyles.activeTab}
      tabTextStyle={sctStyles.text}
      activeTabTextStyle={sctStyles.activeText}
      borderRadius={25}
      values={['Places', 'Events']}
      selectedIndex={selectedIndex}
      onTabPress={index => setIndex(index)}
    />
  </View>
)

const Places = () => (
  <SafeAreaView style={styles.cardsContainer}>
    <FlatList
      data={PLACE_DATA}
      renderItem={({item}) => (
        Place(item.name, item.category, item.image)
      )}
      keyExtractor={item => item.id}
    />
  </SafeAreaView>
);

const Place = (name: string, category: string, image: any) => (
  <View style={cardStyles.container}>
    <Text style={cardStyles.name}>{name}</Text>
    <Text style={cardStyles.category}>{category}</Text>
    <Image style={cardStyles.image} source={image} />
  </View>
);

const Events = () => (
  <SafeAreaView style={styles.cardsContainer}>
    <FlatList
      data={EVENT_DATA}
      renderItem={({item}) => (
        Event(item.name, item.date, item.images)
      )}
      keyExtractor={item => item.id}
    />
  </SafeAreaView>
);

const Event = (name: string, date: string, images: any[]) => (
  <View style={cardStyles.container}>
    <Text style={cardStyles.name}>{name}</Text>
    <Text style={cardStyles.category}>{date}</Text>
    <Image style={cardStyles.image} source={images[0]} />
    <Image style={cardStyles.imageOverlap} source={images[1]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  background: {
    width: W,
    height: 240,
    tintColor: colors.fill, 
  },
  title: {
    position: 'absolute',
    top: 60,
    left: 30,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.black,
  },
  search: {
    position: 'absolute',
    top: 64,
    right: 30,
    width: 24,
    height: 24,
    tintColor: colors.black
  },
  sctContainer: {
    position: 'absolute',
    top: 120,
  },
  cardsContainer: {
    position: 'absolute',
    top: 240,
    width: W - 60,
    height: H - 240,
  },
});

const sctStyles = StyleSheet.create({
  container: {
    width: W - 60,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
  },
  tab: {
    margin: 5,
    borderRadius: 20,
    borderColor: colors.grey,
    backgroundColor: colors.grey,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  activeText: {
    color: colors.accent,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    width: W - 60,
    height: 200,
    marginBottom: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
  },
  category: {
    marginVertical: 2,
    fontSize: 12,
    color: colors.accent,
  },
  image: {
    width: W - 60,
    height: 164,
    borderRadius: 10,
  },
  imageOverlap: {
    bottom: 159,
    left: 5,
    width: W - 70,
    height: 164,
    borderRadius: 10,
    zIndex: -1,
  },
});

export default Library;
