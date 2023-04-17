import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {s} from 'react-native-size-matters';
import {genres} from '../../constants/genres';
import PlaceCard from '../components/PlaceCard';
import {ScrollView} from 'react-native-gesture-handler';

const TEMP_DATA = [
  {
    id: '1',
    name: 'The Witcher',
    image: 'https://image.tmdb.org/t/p/w500/2W4ZvACURDyhiNnSIaFPHfNbny3.jpg',
    rating: 8.5,
    date: '2020-12-25',
    marked: false,
  },
  {
    id: '2',
    name: 'The Mandalorian',
    image: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
    rating: 8.5,
    date: '2020-12-25',
    marked: true,
  },
  {
    id: '3',
    name: 'The Witcher',
    image: 'https://image.tmdb.org/t/p/w500/2W4ZvACURDyhiNnSIaFPHfNbny3.jpg',
    rating: 8.5,
    date: '2020-12-25',
    marked: true,
  },
];

const LiveCategory = ({navigation}: {navigation: any}) => {
  const [radius, setRadius] = useState(50);
  const [time, setTime] = useState('This Weekend');
  const [filters, setFilters] = useState(['Blues', 'Classical']);
  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Trending')}>
          <Image style={headerStyles.back} source={icons.next} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>Concerts</Text>
        <TouchableOpacity onPress={() => console.log('Customize Screen')}>
          <Image style={headerStyles.settings} source={icons.settings} />
        </TouchableOpacity>
      </SafeAreaView>
      <View style={filterStyles.container}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={filterStyles.contentContainer}
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={filterStyles.chip}>
            <Text style={filterStyles.text}>
              {radius + strings.createTabStack.milesAbbrev}
            </Text>
            <View style={filterStyles.drop}>
              <Image style={[filterStyles.icon]} source={icons.next} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={filterStyles.chip}>
            <Text style={filterStyles.text}>{time}</Text>
            <View style={filterStyles.drop}>
              <Image style={filterStyles.icon} source={icons.next} />
            </View>
          </TouchableOpacity>
          <View style={filterStyles.chip}>
            <Text style={filterStyles.text}>
              {filters.length === 0? 'All' : (filters.length > 1? filters[0] + ' +' + (filters.length - 1) : filters[0])}
            </Text>
          </View>
          {/* {filters.map((filter, idx) => (
            <View key={idx} style={filterStyles.chip}>
              <Text style={filterStyles.text}>{filter}</Text>
              <TouchableOpacity
                onPress={() => {
                  const newFilters = filters.filter((_, jdx) => jdx !== idx);
                  setFilters(newFilters);
                }}>
                <Image style={filterStyles.x} source={icons.x} />
              </TouchableOpacity>
            </View>
          ))} */}
        </ScrollView>
        <View style={filterStyles.filterContainer}>
          <TouchableOpacity onPress={() => console.log('Filter Screen')}>
            <Image style={filterStyles.filter} source={icons.filter} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {genres[0].categories[0].subcategories?.map((category, idx) => (
          <View key={idx} style={categoryStyles.container}>
            <View style={categoryStyles.header}>
              <Text style={categoryStyles.title}>{category.title}</Text>
            </View>
            <ScrollView
              contentContainerStyle={categoryStyles.contentContainer}
              style={categoryStyles.scrollView}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {TEMP_DATA.map((item: any, jdx) => (
                <TouchableOpacity
                  style={categoryStyles.card}
                  key={jdx}
                  onPress={() => console.log("Lavy's backend magic")}>
                  <PlaceCard
                    id={item?.id}
                    name={item?.name}
                    info={item?.date}
                    marked={item?.marked}
                    image={{uri: item?.image}}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Spacer />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginLeft: s(20),
    marginTop: s(10),
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
  },
  title: {
    fontSize: s(18),
    fontWeight: '700',
    color: colors.black,
    marginVertical: s(15),
  },
  back: {
    width: s(12),
    height: s(18),
    marginRight: s(6),
    tintColor: colors.black,
    transform: [{rotate: '180deg'}],
  },
  settings: {
    width: s(18),
    height: s(18),
    tintColor: colors.black,
  },
});

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
    paddingVertical: s(7),
  },
  chip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.accent,
    backgroundColor: colors.grey,
    borderRadius: s(20),
    paddingHorizontal: s(12),
    paddingVertical: s(7),
    marginRight: s(7),
  },
  text: {
    fontSize: s(11),
    fontWeight: '600',
    color: colors.black,
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(7),
    width: s(12),
    height: s(8),
  },
  icon: {
    width: s(8),
    height: s(12),
    tintColor: colors.accent,
    transform: [{rotate: '90deg'}],
  },
  x: {
    marginLeft: s(5),
    width: s(10),
    height: s(10),
    tintColor: colors.black,
  },
  filterContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: s(40),
    borderLeftWidth: 0.5,
    borderLeftColor: colors.grey,
  },
  filter: {
    width: s(21),
    height: s(21),
    tintColor: colors.accent,
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    marginTop: s(10),
  },
  header: {
    marginHorizontal: s(20),
    marginBottom: s(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: s(16),
    fontWeight: '700',
    color: colors.black,
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

export default LiveCategory;
