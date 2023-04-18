import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {s} from 'react-native-size-matters';
import {genres} from '../../constants/genres';
import PlaceCard from '../components/PlaceCard';
import {ScrollView} from 'react-native-gesture-handler';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BlurView} from '@react-native-community/blur';

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
  const [radius, setRadius] = useState(0);
  const [time, setTime] = useState(0);
  const [sort, setSort] = useState(0);
  const [filters, setFilters] = useState([]);

  const [bottomSheetOpen, setBottomSheetOpen] = useState('');
  const bottomSheetRef: any = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const handleSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      console.log(fromIndex, toIndex);
      if (fromIndex === 0 || toIndex !== 0) {
        setBottomSheetOpen('');
      }
    },
    [],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.button}
          onPress={() => navigation.navigate('Trending')}>
          <Image style={headerStyles.back} source={icons.next} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>Concerts</Text>
      </SafeAreaView>
      <View style={filterStyles.container}>
        <ScrollView
          horizontal={true}
          contentContainerStyle={filterStyles.contentContainer}
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={filterStyles.chip}
            onPress={() => {
              bottomSheetRef.current?.present();
              setBottomSheetOpen('filter');
            }}>
            <Text style={filterStyles.text}>
              {filters.length === 0 ? strings.filter.all : filters[0]}
              {filters.length > 1 ? ' +' + (filters.length - 1) : null}
            </Text>
            <View style={filterStyles.drop}>
              <Image style={filterStyles.icon} source={icons.next} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={filterStyles.chip}
            onPress={() => {
              bottomSheetRef.current?.present();
              setBottomSheetOpen('radius');
            }}>
            <Text style={filterStyles.text}>
              {strings.filter.within +
                ': ' +
                genres[0].filters?.radius[radius] +
                strings.createTabStack.milesAbbrev}
            </Text>
            <View style={filterStyles.drop}>
              <Image style={[filterStyles.icon]} source={icons.next} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={filterStyles.chip}
            onPress={() => {
              bottomSheetRef.current?.present();
              setBottomSheetOpen('time');
            }}>
            <Text style={filterStyles.text}>
              {genres[0].filters?.time[time]}
            </Text>
            <View style={filterStyles.drop}>
              <Image style={filterStyles.icon} source={icons.next} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={filterStyles.chip}
            onPress={() => {
              bottomSheetRef.current?.present();
              setBottomSheetOpen('sort');
            }}>
            <Text style={filterStyles.text}>
              {strings.filter.sortby + ': ' + genres[0].filters?.sort[sort]}
            </Text>
            <View style={filterStyles.drop}>
              <Image style={filterStyles.icon} source={icons.next} />
            </View>
          </TouchableOpacity>
        </ScrollView>
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
      {bottomSheetOpen !== '' ? (
        <Pressable
          onPress={() => {
            bottomSheetRef?.current.close();
            setBottomSheetOpen('');
          }}
          style={styles.pressable}>
          {Platform.OS === 'ios' ? (
            <BlurView blurAmount={2} blurType="dark" style={styles.blur} />
          ) : (
            <View style={[styles.blur, styles.nonBlur]} />
          )}
        </Pressable>
      ) : null}
      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        onAnimate={handleSheetAnimate}>
        {bottomSheetOpen === 'filter' ? <View /> : <View />}
      </BottomSheetModal>
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
  pressable: {
    position: 'absolute',
    width: '100%',
    height: '150%',
  },
  blur: {
    width: '100%',
    height: '100%',
  },
  nonBlur: {
    backgroundColor: colors.black,
    opacity: 0.85,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    marginHorizontal: s(20),
  },
  title: {
    fontSize: s(24),
    fontWeight: '700',
    color: colors.black,
    marginVertical: s(15),
  },
  button: {
    width: s(30),
  },
  back: {
    width: s(12),
    height: s(18),
    marginTop: s(10),
    marginRight: s(6),
    tintColor: colors.black,
    transform: [{rotate: '180deg'}],
  },
});

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
    paddingBottom: s(10),
  },
  chip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.darkgrey,
    borderRadius: s(15),
    paddingHorizontal: s(11),
    paddingVertical: s(5),
    marginRight: s(5),
  },
  text: {
    fontSize: s(11),
    fontWeight: '500',
    color: colors.black,
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(5),
    width: s(9),
    height: s(6),
  },
  icon: {
    width: s(6),
    height: s(9),
    tintColor: colors.black,
    transform: [{rotate: '90deg'}],
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
