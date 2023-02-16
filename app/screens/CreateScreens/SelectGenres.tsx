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
import images from '../../constants/Images';
import strings from '../../constants/strings';

const genres = [
  {
    id: 1,
    name: strings.createTabStack.adventure,
    image: images.adventure,
  },
  {
    id: 2,
    name: strings.createTabStack.experience,
    image: images.experience,
  },
  {
    id: 3,
    name: strings.createTabStack.shopping,
    image: images.shopping,
  },
  {
    id: 4,
    name: strings.createTabStack.outdoors,
    image: images.outdoors,
  },
  {
    id: 5,
    name: strings.createTabStack.restaurants,
    image: images.restaurant,
  },
  {
    id: 6,
    name: strings.createTabStack.drinksAndDessert,
    image: images.dessert,
  },
];

const SelectGenres = ({navigation, route}) => {
  console.log(route.params) // save in a useState

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryPress = (category) => {
    console.log(category)
    setSelectedGenre(category.name);
    setModalVisible(true);
  };

  return (
    <SafeAreaView>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('MapSelection')}>
            <Image source={images.BackArrow} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {strings.createTabStack.selectCategories}
          </Text>
          <View />
        </View>
        <View style={styles.categoriesGrid}>
          {genres.map((category) => (
            <TouchableOpacity key={category.id} onPress={() => handleCategoryPress(category)}>
              <Image
                style={styles.categoryImage}
                source={category.image}
              />
              <Text>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.selectedCategoriesContainer}>
          <Text style={styles.selectedCategoriesTitle}>{strings.createTabStack.selectedCategories}</Text>
          <ScrollView contentContainerStyle={styles.selectedCategoriesList}>
            {selectedCategories.map((selected) => (
              <Text key={selected.id} style={styles.selectedCategoryText}>
                {selected.name}
              </Text>
            ))}
          </ScrollView>
          <Button
            title={strings.main.done}
            onPress={() => navigation.navigate('SelectDestinations')}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
          <TouchableOpacity onPress={() => {
            setModalVisible(false); 
            setSelectedGenre('');
          }}>
            <Image source={images.BackArrow} />
          </TouchableOpacity>
          <Text>{selectedGenre}</Text>
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
    backgroundColor: '#fff',
  },
  categoriesContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  categoryImageSelected: {
    borderWidth: 2,
    borderColor: 'blue',
  },
  selectedCategoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  selectedCategoriesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff', 
    width: '100%', 
    height: '80%', 
    borderRadius: 10,
  }
});

export default SelectGenres;
