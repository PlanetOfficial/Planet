import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, FlatList, SafeAreaView} from 'react-native';
import {colors} from "../../constants/colors";
import Shape1 from "../../assets/vectors/shape1.svg";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Svg, Circle, Line } from 'react-native-svg';
import icons from "../../constants/icons";

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

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
    name: 'Mama\'s kitchen',
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
    name: 'Leo\'s Nasty 19th Birthday',
    date: 'June 14th, 2023',
    images: [
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'),
    ]
  },
  {
    id: '2',
    name: 'Donutter First Run',
    date: 'November 19th, 2022',
    images: [
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'),
    ]
  },
  {
    id: '3',
    name: 'Anniversary Night Out',
    date: 'Feburary 2nd, 2024',
    images: [
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'),
    ]
  },
  {
    id: '4',
    name: 'Saturdays are for the Boys',
    date: 'December 18th, 2026',
    images: [
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'), 
      require('../../assets/sharetea.jpeg'),
    ]
  },
];

type PlaceProps = {name: string, category: string, image: any};

const Place = ({name, category, image}: PlaceProps) => (
  <View style={styles.itemPlaceContainer}>
    <Text style={styles.nameTitle}>{name}</Text>
    <Text style={styles.categoryTitle}>{category}</Text>
    <Image style={styles.image} source={image}/>
  </View>
);

type EventProps = {name: string, date: string, images: any[]};
const Event = ({name, date, images}: EventProps) => (
  <View style={styles.itemEventContainer}>
    <Text style={styles.nameTitle}>{name}</Text>
    <Text style={styles.categoryTitle}>{date}</Text>
    <Image style={styles.image} source={images[0]} />
    <Image style={styles.secondImage} source={images[1]} />
    <Image style={styles.thirdImage} source={images[2]} />
  </View>
);

const Library = () => {
  const [selectedIndex, setIndex] = useState(0);
  return (
    <View style={styles.container}>
      <View style={styles.shape1}><Shape1 fill={colors.fill}/></View>
      <Text style={styles.title}>Library</Text>
      <View style={styles.searchButton}>
        <Svg width={40} height={40}>
          <Circle fill={colors.grey} cx={20} cy={20} r={20}/>
        </Svg>
        <Image  style={styles.search} source={icons.share}/>
      </View>
      <View style={styles.segmentedControlTab}>
        <SegmentedControlTab
          tabsContainerStyle={styles.tabsContainer}
          tabStyle={styles.tabs}
          activeTabStyle={styles.activeTab}
          tabTextStyle={styles.tabText}
          activeTabTextStyle={styles.activeTabText}
          borderRadius={25}
          values={["Places", "Events"]}
          selectedIndex={selectedIndex}
          onTabPress={(index) => setIndex(index)}
        />
      </View>
      {selectedIndex == 0?
      <>
        <Text style={styles.sortBy}>Sort by: Date Saved</Text>
        <SafeAreaView style={styles.placeContainer}>
          <FlatList
            data={PLACE_DATA}
            renderItem={({item}) => <Place name={item.name} category={item.category} image={item.image}/>}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </>:<>
        <Text style={styles.sortBy}>Sort by: Date Planned</Text>
        <SafeAreaView style={styles.placeContainer}>
          <FlatList
            data={EVENT_DATA}
            renderItem={({item}) => <Event name={item.name} date={item.date} images = {item.images}/>}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: colors.white,
  },
  shape1: {
    width: "100%",
    aspectRatio: 1,
    position: "absolute",
    top: 0
  },
  title: {
    position: "absolute",
    top: 60,
    left: 35,

    // font-family: 'Lato;,
    fontSize: 32,
    fontWeight: 'bold',

    color: colors.black,
  },
  search: {
    position: "absolute",
    alignItems: 'center',
    justifyContent: 'center',
    width: 20, 
    height: 20,
    top: 9,
    left: 9,
    tintColor: colors.black,
  },
  searchButton: {
    width: "100%",
    aspectRatio: 1,
    position: "absolute",
    top: 60,
    left: W - 75,
  },
  segmentedControlTab: {
    position: "absolute",
    top: 125,
  },
  tabsContainer: {
    width: 320,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grey,
  },
  tabs: {
    borderRadius: 25,
    width: 155,
    height: 40,
    margin: 5,
    borderWidth: 0,
    borderColor: colors.grey,
    backgroundColor: colors.grey
  },
  activeTab: {
    backgroundColor: colors.white,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  activeTabText: {
    color: colors.accent,
  },
  sortBy:{
    position: "absolute",
    fontSize: 14,
    color: colors.accent,
    top: 210,
    right: 40,
  },
  placeContainer: {
    position: "absolute",
    top: 240,
    height: H - 240,
    width: W - 70,
  },
  itemPlaceContainer: {
    width: 320,
    height: 200,
    marginBottom: 20,
  },
  itemEventContainer: {
    width: 320,
    height: 210,
    marginBottom: 20,
  },
  nameTitle: {
    position: "relative",
    fontWeight: "bold",
    fontSize: 20,
    color: colors.black,
  },
  categoryTitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.accent,
    marginBottom: 2,
  },
  image: {
    width: W - 70,
    height: 164,
    borderRadius: 10,
  },
  secondImage: {
    width: W - 80,
    height: 164,
    left: 5,
    bottom: 159,
    borderRadius: 10,
    zIndex: -1,
  },
  thirdImage: {
    width: W - 90,
    height: 164,
    left: 10,
    bottom: 318,
    borderRadius: 10,
    zIndex: -2,
  },
});

export default Library;