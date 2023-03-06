import React, {useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image, FlatList, SafeAreaView} from 'react-native';
import {colors} from "../../constants/colors";
import Shape1 from "../../assets/vectors/shape1.svg";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Svg, Circle } from 'react-native-svg';
import icons from "../../constants/icons";

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const DATA = [
  {
    id: '1',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
  },
  {
    id: '2',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
  },
  {
    id: '3',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
  },
  {
    id: '4',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
  },
  {
    id: '5',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
  },
  {
    id: '6',
    name: 'Share Tea',
    category: 'Bubble Tea Shop',
  },
];

type ItemProps = {name: string, category: string};

const Item = ({name, category}: ItemProps) => (
  <View style={styles.itemContainer}>
    <Text style={styles.nameTitle}>{name}</Text>
    <Text style={styles.categoryTitle}>{category}</Text>
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
        <Image style={styles.search} source={icons.share}/>
      </View>
      <View style={styles.segmentedControlTab}>
        <SegmentedControlTab
          tabsContainerStyle={styles.tabsContainer}
          tabStyle={styles.tabs}
          activeTabStyle={styles.activeTab}
          tabTextStyle={styles.tabText}
          activeTabTextStyle={styles.activeTabText}
          borderRadius={25}
          values={["Events", "Places"]}
          selectedIndex={selectedIndex}
          onTabPress={(index) => setIndex(index)}
        />
      </View>
      <Text style={styles.sortBy}>Sort by: Date Saved</Text>
      <SafeAreaView style={styles.placeContainer}>
        <FlatList
          data={DATA}
          renderItem={({item}) => <Item name={item.name} category={item.category}/>}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
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
  itemContainer: {
    width: 320,
    height: 200,
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
  },
});

export default Library;