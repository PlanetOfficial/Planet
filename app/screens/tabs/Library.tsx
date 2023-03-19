import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {s} from 'react-native-size-matters';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {miscIcons, vectors} from '../../constants/images';

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

const Library = ({navigation}: {navigation: any}) => {
  const [selectedIndex, setIndex] = useState(0);
  return (
    <View style={styles.container}>
      <Image style={styles.background} source={vectors.shape1} />
      {Header(navigation)}
      {SegmentedControl(selectedIndex, setIndex)}
      {selectedIndex === 0 ? Places() : Events()}
    </View>
  );
};

const Header = ({navigation}: {navigation: any}) => (
  <View style={headerStyles.container}>
    <Text style={headerStyles.title}>{strings.title.library}</Text>
    <TouchableOpacity
      style={headerStyles.searchButton}
      onPress={() => navigation.navigate()}>
      <Image style={headerStyles.search} source={miscIcons.search} />
    </TouchableOpacity>
  </View>
);

const SegmentedControl = (
  selectedIndex: number,
  setIndex: React.Dispatch<React.SetStateAction<number>>,
) => (
  <SegmentedControlTab
    tabsContainerStyle={sctStyles.container}
    tabStyle={sctStyles.tab}
    activeTabStyle={sctStyles.activeTab}
    tabTextStyle={sctStyles.text}
    activeTabTextStyle={sctStyles.activeText}
    borderRadius={25}
    values={[strings.library.saved, strings.library.events]}
    selectedIndex={selectedIndex}
    onTabPress={index => setIndex(index)}
  />
);

const Places = () => (
  <SafeAreaView style={styles.cardsContainer}>
    <FlatList
      data={PLACE_DATA}
      renderItem={({item}) => Place(item.name, item.category, item.image)}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
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
      renderItem={({item}) => Event(item.name, item.date, item.images)}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
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
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  background: {
    resizeMode: 'stretch',
    width: '100%',
    height: s(200),
    tintColor: colors.fill,
  },
  cardsContainer: {
    // TODO: make scrolling more natural (doesn't get cut off)
    position: 'absolute',
    top: s(200),
    width: s(300),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: s(50),
    width: s(300),
  },
  title: {
    fontSize: s(28),
    fontWeight: 'bold',
    color: colors.black,
  },
  searchButton: {
    position: 'absolute',
    right: 0,
    width: s(20),
    height: s(20),
  },
  search: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const sctStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: s(100),
    width: s(300),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: colors.grey,
  },
  tab: {
    margin: s(4),
    borderRadius: s(16),
    borderColor: colors.grey,
    backgroundColor: colors.grey,
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  text: {
    color: colors.black,
    fontSize: s(14),
    fontWeight: 'bold',
  },
  activeText: {
    color: colors.accent,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    height: s(200),
    marginBottom: s(25),
  },
  name: {
    fontSize: s(18),
    fontWeight: 'bold',
    color: colors.black,
  },
  category: {
    marginVertical: s(2),
    fontSize: s(12),
    color: colors.accent,
  },
  image: {
    width: '100%',
    height: s(164),
    borderRadius: s(10),
  },
  imageOverlap: {
    bottom: s(159),
    left: s(5),
    width: s(290),
    height: s(164),
    borderRadius: s(10),
    zIndex: -1,
  },
});

export default Library;
