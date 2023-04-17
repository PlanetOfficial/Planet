import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {s} from 'react-native-size-matters';
import {genres} from '../../constants/genres';
import PlaceCard from '../components/PlaceCard';

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
  {
    id: '4',
    name: 'The Mandalorian',
    image: 'https://image.tmdb.org/t/p/w500/sWgBv7LV2PRoQgkxwlibdGXKz1S.jpg',
    rating: 8.5,
    date: '2020-12-25',
    marked: true,
  },
];

const Trending = () => {
  return (
    <SafeAreaView testID="trendingScreenView" style={styles.container}>
      <View style={headerStyles.container}>
        <View style={headerStyles.titles}>
          <Text style={headerStyles.title}>{strings.title.trending}</Text>
          <Text style={headerStyles.in}>{strings.trending.in}</Text>
          <TouchableOpacity
            style={headerStyles.fgSelector}
            onPress={() => console.log('switch location')}>
            <Text numberOfLines={1} style={headerStyles.location}>
              Seattle
            </Text>
            <View style={headerStyles.drop}>
              <Image style={[headerStyles.icon]} source={icons.next} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => console.log('TO BE IMPLEMENTED')}>
          <Image style={headerStyles.search} source={icons.search} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {genres[0].categories.map((category, idx) => (
          <View key={idx} style={categoryStyles.container}>
            <View style={categoryStyles.header}>
              <Text style={categoryStyles.title}>{category.name}</Text>
              <TouchableOpacity
                onPress={() => console.log('TO BE IMPLEMENTED')}>
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
              {TEMP_DATA.map((item: any, jdx) => (
                <TouchableOpacity
                  style={categoryStyles.card}
                  key={jdx}
                  onPress={() => console.log('TO BE IMPLEMENTED')}>
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
            {idx === genres[0].categories.length - 1 ? <View style={styles.bottomPadding}/> : <Spacer />}
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
  }
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
    fontSize: s(24),
    fontWeight: '700',
    color: colors.black,
  },
  in: {
    fontSize: s(22),
    fontWeight: '700',
    color: colors.darkgrey,
    marginHorizontal: s(6),
  },
  location: {
    fontSize: s(25),
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
    width: s(15),
    height: s(10),
  },
  icon: {
    width: s(10),
    height: s(15),
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
