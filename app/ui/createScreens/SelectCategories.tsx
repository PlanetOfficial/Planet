import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {vectors, icons, genreIcons} from '../../constants/images';
import strings from '../../constants/strings';
import {getCategories} from '../../utils/api/CreateCalls/getCategories';
import {colors} from '../../constants/theme';

// TODO: retrieve genres data from the database instead.
const genres = [
  {
    id: 1,
    name: strings.createTabStack.recreation,
    image: genreIcons.recreation,
  },
  {
    id: 2,
    name: strings.createTabStack.experience,
    image: genreIcons.experience,
  },
  {
    id: 3,
    name: strings.createTabStack.shopping,
    image: genreIcons.shopping,
  },
  {
    id: 4,
    name: strings.createTabStack.outdoors,
    image: genreIcons.outdoors,
  },
  {
    id: 6,
    name: strings.createTabStack.restaurants,
    image: genreIcons.restaurants,
  },
  {
    id: 5,
    name: strings.createTabStack.sweets,
    image: genreIcons.sweets,
  },
];

const SelectCategories = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [latitude] = useState(route?.params?.latitude);
  const [longitude] = useState(route?.params?.longitude);
  const [radius] = useState(route?.params?.radius); // in meters

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories]: [any, any] = useState([]);

  const [cachedGenres, setCachedGenres] = useState({});

  const handleGenrePress = async (genre: any) => {
    setSelectedGenre(genre.name);
    setModalVisible(true);

    // display categories from genre logic
    if (!cachedGenres[genre.id as keyof {}]) {
      // call API and add to cache if not in cache
      const response = await getCategories(genre.id);

      let updatedCache: any = {...cachedGenres};
      updatedCache[genre.id] = response;
      setCachedGenres(updatedCache);

      setAllCategories(response);
    } else {
      setAllCategories(cachedGenres[genre.id as keyof {}]);
    }
  };

  const removeCategory = (categoryId: number) => {
    setSelectedCategories(
      selectedCategories.filter((item: any) => item.id !== categoryId),
    );
  };

  return (
    <SafeAreaView testID="selectCategoriesScreenView" style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          testID="selectCategoriesScreenBack"
          style={headerStyles.back}
          onPress={() => navigation.navigate('MapSelection')}>
          <Image style={headerStyles.icon} source={icons.back} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>
          {strings.createTabStack.selectCategories}
        </Text>
        <TouchableOpacity
          testID="confirmCategories"
          style={headerStyles.confirm}
          onPress={() =>
            navigation.navigate('SelectDestinations', {
              selectedCategories: selectedCategories,
              radius: radius,
              latitude: latitude,
              longitude: longitude,
            })
          }>
          <Image style={headerStyles.icon} source={icons.confirm} />
        </TouchableOpacity>
      </View>
      <View style={genreStyles.container}>
        {genres.map(genre => (
          <TouchableOpacity
            testID={'genre.' + genre.id}
            key={genre.id}
            onPress={() => handleGenrePress(genre)}>
            <View style={genreStyles.imageContainer}>
              <Image style={genreStyles.image} source={genre.image} />
            </View>
            <Image style={genreStyles.blur} source={vectors.blur} />
            <Text style={genreStyles.text}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={selectionStyles.container}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {selectedCategories.map((selected: any) => (
            <View key={selected.id} style={selectionStyles.category}>
              <Image style={selectionStyles.icon} source={icons.tempCategory} />
              {/* TODO: remove categories when pressed. */}
              <TouchableOpacity
                style={selectionStyles.xButton}
                onPress={() => removeCategory(selected.id)}>
                <Image style={selectionStyles.x} source={icons.x} />
              </TouchableOpacity>
              <Text style={selectionStyles.name}>{selected.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <Pressable
          style={styles.dim}
          onPress={() => {
            setModalVisible(false);
            setSelectedGenre('');
          }}
        />
        <View testID="categoryModalView" style={modalStyles.container}>
          <View style={modalStyles.header}>
            <Pressable
              testID="closeModalView"
              onPress={() => {
                setModalVisible(false);
                setSelectedGenre('');
              }}
              style={modalStyles.x}>
              <Image style={modalStyles.icon} source={icons.x} />
            </Pressable>
            <Text style={modalStyles.title}>{selectedGenre}</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={modalStyles.categories}>
              {allCategories
                ? allCategories?.map((category: any) => (
                    <TouchableOpacity
                      testID={'category.' + category.id}
                      key={category.id}
                      onPress={() => {
                        if (
                          !selectedCategories.find(
                            (item: any) => item.id === category.id,
                          )
                        ) {
                          setSelectedCategories((prevCategories: any) => [
                            ...prevCategories,
                            {id: category.id, name: category.name},
                          ]);
                        }
                      }}>
                      <View style={categoryStyles.container}>
                        {/* TODO: display correct category icon. */}
                        <Image
                          style={categoryStyles.image}
                          source={icons.settings}
                        />
                        <Text style={categoryStyles.name}>{category.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                : null}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
  dim: {
    width: '100%',
    height: '200%',
    position: 'absolute',
    backgroundColor: colors.black,
    opacity: 0.5,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    paddingBottom: 0,
  },
  title: {
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
  },
  back: {
    marginRight: s(20 / 3),
    width: s(40 / 3),
    height: s(20),
  },
  confirm: {
    width: s(20),
    height: s(20),
  },
  icon: {
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
});

const genreStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageContainer: {
    margin: s(15),
    width: s(130),
    height: s(130),
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: s(10),
    backgroundColor: colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: colors.white,
  },
  text: {
    position: 'absolute',
    margin: s(15),
    width: s(130),
    top: s(56),
    fontSize: s(15),
    fontWeight: '700',
    textAlign: 'center',
    color: colors.white,
  },
  blur: {
    position: 'absolute',
    marginTop: s(55),
    width: s(160),
    height: s(50),
    resizeMode: 'stretch',
    tintColor: colors.black,
    opacity: 0.6,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: s(15),
    top: '15%',
    width: s(320),
    height: '65%',
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: colors.white,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
    backgroundColor: colors.white,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(50),
    backgroundColor: colors.accent,
    borderTopLeftRadius: s(8),
    borderTopRightRadius: s(8),
  },
  title: {
    width: s(250),
    fontSize: s(20),
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  x: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -s(13),
    right: -s(13),
    padding: s(13),
    width: s(18),
    height: s(18),
    backgroundColor: colors.grey,
    borderRadius: s(13),
  },
  icon: {
    width: s(14),
    height: s(14),
    tintColor: colors.black,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    width: s(158),
    height: s(60),
  },
  image: {
    position: 'absolute',
    width: s(40),
    height: s(40),
    marginLeft: s(10),
    borderRadius: s(20),
    borderWidth: 2,
    tintColor: colors.black,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  name: {
    marginLeft: s(60),
    width: s(95),
    fontSize: s(14),
    fontWeight: '700',
    color: colors.black,
  },
});

const selectionStyles = StyleSheet.create({
  container: {
    height: s(70),
    bottom: 0,
    width: '100%',
    borderTopWidth: 2,
    borderColor: colors.accent,
  },
  category: {
    alignItems: 'center',
    width: s(80),
  },
  icon: {
    position: 'absolute',
    width: s(40),
    height: s(40),
    top: s(10),
    borderRadius: s(20),
    borderWidth: 2,
    tintColor: colors.black,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  xButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: s(46),
    top: s(4),
    width: s(20),
    height: s(20),
    backgroundColor: colors.grey,
    borderRadius: s(10),
  },
  x: {
    width: '60%',
    height: '60%',
    tintColor: colors.black,
  },
  name: {
    top: s(53),
    fontSize: s(14),
    fontWeight: '500',
    color: colors.black,
    textAlign: 'center',
  },
});

export default SelectCategories;
