import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import { getCatFiltered } from '../../utils/api/shared/getCatFiltered';
import { integers } from '../../constants/numbers';
import { Subcategory } from '../../utils/interfaces/subcategory';

const LiveCategory = ({navigation, route}: {navigation: any; route: any;}) => {
  const [radiusDistance, setRadiusDistance] = useState(route?.params?.radius);
  const [longitude, setLongitude] = useState(route?.params?.longitude);
  const [latitude, setLatitude] = useState(route?.params?.latitude);
  const [categoryId, setCategoryId] = useState(route?.params?.categoryId);
  const [categoryName, setCategoryName] = useState(route?.params?.categoryName);
  const [daysToAdd, setDaysToAdd] = useState(integers.defaultDaysToAdd2);
  const [sortByDistance, setSortByDistance] = useState(false);

  const [subcategories, setSubcategories] = useState([]);
  const [hiddenSubCategories, setHiddenSubCategories] = useState([]);

  const [places, setPlaces]: [any, any] = useState({});

  const [loading, setLoading] = useState(false);

  const [radius, setRadius] = useState(0);
  const [time, setTime] = useState(0);
  const [sort, setSort] = useState(0);

  const [dropdownStatus, setDropdownStatus]: [any, any] = useState('');

  const radiusRef: any = React.useRef(null);
  const timeRef: any = React.useRef(null);
  const sortRef: any = React.useRef(null);
  const [pos, setPos]: [number, any] = useState(0);
  const [width, setWidth]: [number, any] = useState(0);
  const handleMeasure = (ref: any) => {
    ref.current.measureInWindow((x: any, y: any, w: any) => {
      if (x < s(10)) {
        setPos(s(10));
      } else if (x + w > s(340)) {
        setPos(s(340) - w);
      } else {
        setPos(x);
      }
      setWidth(w);
    });
  };

  const handleRadiusOptionPress = (option: any) => {
    if (genres[0]?.filters?.radius[option]) {
      const radiusInMeters = genres[0]?.filters?.radius[option] * integers.milesToMeters;
      
      if (radiusInMeters <= integers.maxRadiusInMeters) {
        setRadiusDistance(radiusInMeters);
      } else {
        setRadiusDistance(integers.maxRadiusInMeters);
      }
    }

    setRadius(option);
    closeDropdown();
  };
  const handleTimeOptionPress = (option: any) => {
    if (genres[0]?.filters?.time[option]?.days) {
      setDaysToAdd(genres[0].filters?.time[option].days)
    }

    setTime(option);
    closeDropdown();
  };
  const handleSortOptionPress = (option: any) => {
    if (genres[0]?.filters?.sort[option] === 'Distance') {
      setSortByDistance(true)
    } else {
      setSortByDistance(false);
    }

    setSort(option);
    closeDropdown();
  };
  const closeDropdown = () => {
    setDropdownStatus('');
    setPos(0);
    setWidth(0);
  };

  useEffect(() => {
    const initializeData = async () => {
      if (route?.params?.subcategories) {
        setSubcategories(route?.params?.subcategories);

        const subcategoryIds: number[] = route?.params?.subcategories?.map((item: any) => item.id);

        setLoading(true);
        const response = await getCatFiltered(subcategoryIds, integers.defaultNumPlaces, latitude, longitude, daysToAdd, radiusDistance, categoryId, sortByDistance);
        setPlaces(response?.places);
        setLoading(false);
      }

      if (route?.params?.hiddenSubCategories) {
        setHiddenSubCategories(route?.params?.hiddenSubCategories);
      }
    }

    initializeData();
  }, [route?.params?.subcategories, radiusDistance, daysToAdd, sortByDistance]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.button}
          onPress={() => navigation.navigate('Trending')}>
          <Image style={headerStyles.back} source={icons.next} />
        </TouchableOpacity>
        <View style={headerStyles.row}>
          <Text style={headerStyles.title}>{categoryName}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('LiveCategorySettings', {
              subcategories,
              hiddenSubCategories,
            })}>
            <Image style={headerStyles.settings} source={icons.settings} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View style={filterStyles.container}>
        <ScrollView
          onScrollBeginDrag={() => closeDropdown()}
          horizontal={true}
          style={[filterStyles.scrollView]}
          contentContainerStyle={[filterStyles.contentContainer]}
          showsHorizontalScrollIndicator={false}>
          <View style={filterStyles.chipContainer}>
            <TouchableOpacity
              ref={radiusRef}
              style={filterStyles.chip}
              onPress={() => {
                if (dropdownStatus === 'radius') {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  setDropdownStatus('radius');
                  handleMeasure(radiusRef);
                }
              }}>
              <Text
                style={[
                  filterStyles.text,
                  {
                    color:
                      dropdownStatus === 'radius'
                        ? colors.darkgrey
                        : colors.black,
                  },
                ]}>
                {strings.filter.within +
                  ': ' +
                  genres[0].filters?.radius[radius] +
                  strings.createTabStack.milesAbbrev}
              </Text>
              <View style={filterStyles.drop}>
                <Image
                  style={[
                    filterStyles.icon,
                    {
                      tintColor:
                        dropdownStatus === 'radius'
                          ? colors.darkgrey
                          : colors.black,
                    },
                  ]}
                  source={icons.next}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={filterStyles.chipContainer}>
            <TouchableOpacity
              ref={timeRef}
              style={filterStyles.chip}
              onPress={() => {
                if (dropdownStatus === 'time') {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  setDropdownStatus('time');
                  handleMeasure(timeRef);
                }
              }}>
              <Text
                style={[
                  filterStyles.text,
                  {
                    color:
                      dropdownStatus === 'time'
                        ? colors.darkgrey
                        : colors.black,
                  },
                ]}>
                {strings.filter.inTheNext +
                  ': ' +
                  genres[0].filters?.time[time]?.name}
              </Text>
              <View style={filterStyles.drop}>
                <Image
                  style={[
                    filterStyles.icon,
                    {
                      tintColor:
                        dropdownStatus === 'time'
                          ? colors.darkgrey
                          : colors.black,
                    },
                  ]}
                  source={icons.next}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={filterStyles.chipContainer}>
            <TouchableOpacity
              ref={sortRef}
              style={filterStyles.chip}
              onPress={() => {
                if (dropdownStatus === 'sort') {
                  closeDropdown();
                } else {
                  if (dropdownStatus !== '') {
                    closeDropdown();
                  }
                  setDropdownStatus('sort');
                  handleMeasure(sortRef);
                }
              }}>
              <Text
                style={[
                  filterStyles.text,
                  {
                    color:
                      dropdownStatus === 'sort'
                        ? colors.darkgrey
                        : colors.black,
                  },
                ]}>
                {strings.filter.sortby + ': ' + genres[0].filters?.sort[sort]}
              </Text>
              <View style={filterStyles.drop}>
                <Image
                  style={[
                    filterStyles.icon,
                    {
                      tintColor:
                        dropdownStatus === 'sort'
                          ? colors.darkgrey
                          : colors.black,
                    },
                  ]}
                  source={icons.next}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {dropdownStatus === 'radius' && width !== 0 && pos !== 0 && (
          <View style={[dropdownStyles.content, {left: pos, width: width}]}>
            {genres[0].filters?.radius.map((option, idx) => (
              <View key={idx}>
                <TouchableOpacity
                  style={dropdownStyles.option}
                  onPress={() => handleRadiusOptionPress(idx)}>
                  <Text style={dropdownStyles.text}>
                    {option + ' ' + strings.createTabStack.milesAbbrev}
                  </Text>
                  {idx === radius && (
                    <Image style={dropdownStyles.check} source={icons.tick} />
                  )}
                </TouchableOpacity>
                {!genres[0]?.filters?.radius?.length ||
                  (idx < genres[0]?.filters?.radius?.length - 1 && (
                    <View style={dropdownStyles.separator} />
                  ))}
              </View>
            ))}
          </View>
        )}
        {dropdownStatus === 'time' && width !== 0 && pos !== 0 && (
          <View style={[dropdownStyles.content, {left: pos, width: width}]}>
            {genres[0].filters?.time.map((option, idx) => (
              <View key={idx}>
                <TouchableOpacity
                  style={dropdownStyles.option}
                  onPress={() => handleTimeOptionPress(idx)}>
                  <Text style={dropdownStyles.text}>{option.name}</Text>
                  {idx === time && (
                    <Image style={dropdownStyles.check} source={icons.tick} />
                  )}
                </TouchableOpacity>
                {!genres[0]?.filters?.radius?.length ||
                  (idx < genres[0]?.filters?.time?.length - 1 && (
                    <View style={dropdownStyles.separator} />
                  ))}
              </View>
            ))}
          </View>
        )}

        {dropdownStatus === 'sort' && width !== 0 && pos !== 0 && (
          <View style={[dropdownStyles.content, {left: pos, width: width}]}>
            {genres[0].filters?.sort.map((option, idx) => (
              <View key={idx}>
                <TouchableOpacity
                  style={dropdownStyles.option}
                  onPress={() => handleSortOptionPress(idx)}>
                  <Text style={dropdownStyles.text}>{option}</Text>
                  {idx === sort && (
                    <Image style={dropdownStyles.check} source={icons.tick} />
                  )}
                </TouchableOpacity>
                {!genres[0]?.filters?.radius?.length ||
                  (idx < genres[0]?.filters?.sort?.length - 1 && (
                    <View style={dropdownStyles.separator} />
                  ))}
              </View>
            ))}
          </View>
        )}
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} />
        ) : null}
      </View>
      <ScrollView onTouchStart={() => closeDropdown()}>
        {subcategories?.map((subcategory: Subcategory, idx: number) => (
          <View key={idx} style={categoryStyles.container}>
            <View style={categoryStyles.header}>
              <Text style={categoryStyles.title}>{subcategory.title}</Text>
            </View>
            <ScrollView
              contentContainerStyle={categoryStyles.contentContainer}
              style={categoryStyles.scrollView}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {places[subcategory?.id] ? places[subcategory?.id].map((dest: any, jdx: number) => (
                <TouchableOpacity
                  style={categoryStyles.card}
                  key={jdx}
                  onPress={() => navigation.navigate('Place', {
                    destination: dest,
                    category: categoryName,
                  })}>
                  <PlaceCard
                    id={dest?.id}
                    name={dest?.name}
                    info={dest?.date}
                    marked={dest?.marked}
                    image={{uri: dest?.image_url}}
                  />
                </TouchableOpacity>
              )) : null}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  back: {
    width: s(12),
    height: s(18),
    marginTop: s(10),
    marginRight: s(6),
    tintColor: colors.black,
    transform: [{rotate: '180deg'}],
  },
  settings: {
    width: s(16),
    height: s(16),
    tintColor: colors.black,
  },
});

const filterStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
    zIndex: 1,
  },
  scrollView: {
    overflow: 'visible',
  },
  contentContainer: {
    paddingLeft: s(20),
    paddingRight: s(5),
    paddingBottom: s(10),
    overflow: 'visible',
  },
  chipContainer: {
    marginRight: s(5),
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
    height: s(25),
  },
  text: {
    fontSize: s(11),
    fontWeight: '500',
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
    transform: [{rotate: '90deg'}],
  },
});

const dropdownStyles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: s(25),
    borderRadius: s(10),
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: s(10),
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: '#ccc',
    backgroundColor: colors.white,
  },
  text: {
    fontSize: s(11),
    fontWeight: '500',
    color: colors.black,
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.grey,
  },
  check: {
    width: s(12),
    height: s(12),
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
