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
import {s, vs} from 'react-native-size-matters';
import SegmentedControlTab from 'react-native-segmented-control-tab';

import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {miscIcons} from '../../constants/images';

// TEMP
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
    id: '5',
    name: "Leo's Nasty 19th Birthday",
    date: 'June 14th, 2023',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
  {
    id: '6',
    name: 'Donutter First Run',
    date: 'November 19th, 2022',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
  {
    id: '7',
    name: 'Anniversary Night Out',
    date: 'Feburary 2nd, 2024',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
  {
    id: '8',
    name: 'Saturdays are for the Boys',
    date: 'December 18th, 2026',
    images: [
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
      require('../../assets/sharetea.jpeg'),
    ],
  },
  {
    id: '9',
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
      {Header(navigation)}
      {SegmentedControl(selectedIndex, setIndex)}
      <SafeAreaView style={styles.cardsContainer}>
        {selectedIndex === 0 ? Places() : Events()}
      </SafeAreaView>
    </View>
  );
};

const Header = (navigation: any) => (
  <View style={headerStyles.container}>
    <Text style={headerStyles.title}>{strings.title.library}</Text>
    <TouchableOpacity
      style={headerStyles.button}
      onPress={() => navigation.navigate('SearchLibrary')}>
      <Image style={headerStyles.icon} source={miscIcons.search} />
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
    firstTabStyle={sctStyles.firstTab}
    activeTabTextStyle={sctStyles.activeText}
    borderRadius={0}
    values={[strings.library.saved, strings.library.events]}
    selectedIndex={selectedIndex}
    onTabPress={index => setIndex(index)}
  />
);

const Places = () => (
  <FlatList
    data={PLACE_DATA}
    renderItem={({item}) => Place(item.name, item.category, item.image)}
    keyExtractor={item => item.id}
    showsVerticalScrollIndicator={false}
  />
);

const Place = (name: string, category: string, image: any) => (
  <View style={cardStyles.container}>
    <Text style={cardStyles.name}>{name}</Text>
    <Text style={cardStyles.info}>{category}</Text>
    <Image style={cardStyles.image} source={image} />
  </View>
);

const Events = () => (
  <FlatList
    data={EVENT_DATA}
    renderItem={({item}) => Event(item.name, item.date, item.images)}
    keyExtractor={item => item.id}
    showsVerticalScrollIndicator={false}
  />
);

const Event = (name: string, date: string, images: any[]) => (
  <View style={cardStyles.container}>
    <Text style={cardStyles.name}>{name}</Text>
    <Text style={cardStyles.info}>{date}</Text>
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
  cardsContainer: {
    flex: 1,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(50),
    width: s(300),
  },
  title: {
    fontSize: s(28),
    fontWeight: '700',
    color: colors.black,
  },
  button: {
    position: 'absolute',
    right: 0,
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const sctStyles = StyleSheet.create({
  container: {
    marginTop: vs(20),
    width: s(300),
    height: s(30),
  },
  tab: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  activeTab: {
    backgroundColor: colors.white,
    borderBottomWidth: 3,
    borderBottomColor: colors.accent,
  },
  firstTab: {
    borderRightWidth: 0,
  },
  text: {
    marginBottom: 2,
    fontSize: s(14),
    fontWeight: '700',
    color: colors.black,
  },
  activeText: {
    marginBottom: 0,
    color: colors.accent,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
    height: s(210),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  name: {
    marginHorizontal: s(5),
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
  },
  info: {
    marginHorizontal: s(5),
    fontSize: s(12),
    fontWeight: '500',
    color: colors.accent,
  },
  image: {
    marginTop: s(3),
    width: s(300),
    height: s(160),
    borderRadius: s(10),
  },
  imageOverlap: {
    position: 'absolute',
    bottom: s(4),
    left: s(5),
    width: s(290),
    height: s(160),
    borderRadius: s(10),
    zIndex: -1,
  },
});

export default Library;
