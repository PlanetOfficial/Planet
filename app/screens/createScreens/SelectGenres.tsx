import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Button,
  Modal,
} from 'react-native';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import { integers } from '../../constants/numbers';
import {getCategories} from '../../utils/api/CreateCalls/getCategories';
import {colors} from '../../constants/theme';

// TODO: remove this and make it dynamic once images are settled
const genres = [
  {
    id: 1,
    name: strings.createTabStack.adventure,
    image: icons.adventure,
  },
  {
    id: 2,
    name: strings.createTabStack.experience,
    image: icons.experience,
  },
  {
    id: 3,
    name: strings.createTabStack.shopping,
    image: icons.shopping,
  },
  {
    id: 4,
    name: strings.createTabStack.outdoors,
    image: icons.outdoors,
  },
  {
    id: 6,
    name: strings.createTabStack.restaurants,
    image: icons.restaurant,
  },
  {
    id: 5,
    name: strings.createTabStack.drinksAndDessert,
    image: icons.dessert,
  },
];

const SelectGenres = ({navigation, route}) => {
  const [latitude, setLatitude] = useState(route?.params?.latitude);
  const [longitude, setLongitude] = useState(route?.params?.longitude);
  const [radius, setRadius] = useState(0); // in meters

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [cachedGenres, setCachedGenres] = useState({});

  const setRadiusParam = () => {
    if (route?.params?.radius) {
      setRadius(route.params.radius);
    }
  };

  useEffect(() => {
    setRadiusParam();
  }, []);

  const handleGenrePress = async genre => {
    setSelectedGenre(genre.name);
    setModalVisible(true);

    // display categories from genre logic
    if (!cachedGenres[genre.id]) {
      // call API and add to cache if not in cache
      const response = await getCategories(genre.id);

      let updatedCache = {...cachedGenres};
      updatedCache[genre.id] = response;
      setCachedGenres(updatedCache);

      setAllCategories(response);
    } else {
      setAllCategories(cachedGenres[genre.id]);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MapSelection')}>
            <Image source={icons.BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {strings.createTabStack.selectCategories}
          </Text>
        </View>
        <View style={styles.categoriesGrid}>
          {genres.map(genre => (
            <TouchableOpacity
              key={genre.id}
              onPress={() => handleGenrePress(genre)}>
              <Image style={styles.genreImage} source={genre.image} />
              <Text>{genre.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.selectedCategoriesContainer}>
          <Text style={styles.selectedCategoriesTitle}>
            {strings.createTabStack.selectedCategories}
          </Text>
          <ScrollView contentContainerStyle={styles.selectedCategoriesList}>
            {selectedCategories.map(selected => (
              <Text key={selected.id} style={styles.selectedCategoryText}>
                {selected.name}
              </Text>
            ))}
          </ScrollView>
          <Button
            title={strings.main.done}
            onPress={() =>
              navigation.navigate('SelectDestinations', {
                selectedCategories: selectedCategories,
                radius: radius,
                latitude: latitude,
                longitude: longitude,
              })
            }
          />
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.back}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedGenre('');
                }}>
                <Image source={icons.BackArrow} />
              </TouchableOpacity>
              <View style={styles.genreHeader}>
                <Text style={styles.genreText}>{selectedGenre}</Text>
              </View>
            </View>
            <ScrollView>
              <View>
                {allCategories
                  ? allCategories.map(selected => (
                      <View key={selected.id}>
                        <TouchableOpacity
                          onPress={() => {
                            if (
                              !selectedCategories.find(
                                item => item.id === selected.id,
                              )
                            ) {
                              setSelectedCategories(prevCategories => [
                                ...prevCategories,
                                {id: selected.id, name: selected.name},
                              ]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter(
                                  item => item.id !== selected.id,
                                ),
                              );
                            }
                          }}>
                          <View style={styles.circle}>
                            <Image
                              source={icons.XButton}
                              style={styles.image}
                            />
                          </View>
                          <Text>{selected.name}</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  categoriesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  genreImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  selectedCategoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  selectedCategoriesTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  selectedCategoriesList: {
    alignItems: 'flex-start',
    flexGrow: 1,
    paddingBottom: 20,
  },
  selectedCategoryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  doneButton: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  doneButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fill,
  },
  modalHeader: {
    flexDirection: 'row',
  },
  modalView: {
    backgroundColor: colors.white,
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: colors.accent,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  back: {
    margin: 10,
  },
  SelectGenre: {
    alignItems: 'center',
  },
  genreHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
  },
});

export default SelectGenres;
