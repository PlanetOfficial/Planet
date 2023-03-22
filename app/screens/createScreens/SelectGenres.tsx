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
import {s, vs} from 'react-native-size-matters';

import {vectors, miscIcons, genreIcons} from '../../constants/images';
import strings from '../../constants/strings';
import integers from '../../constants/integers';
import {getCategories} from '../../utils/api/CreateCalls/getCategories';
import {colors} from '../../constants/theme';

// TODO: remove this and make it dynamic once images are settled
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

const SelectGenres = ({navigation, route}: {navigation: any, route: any}) => {
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
      setRadius(parseFloat(route.params.radius) * integers.milesToMeters);
    }
  };

  useEffect(() => {
    setRadiusParam();
  }, []);

  const handleGenrePress = async (genre: any) => {
    setSelectedGenre(genre.name);
    setModalVisible(true);

    // display categories from genre logic
    if (!cachedGenres[genre.id as keyof {}]) {
      // call API and add to cache if not in cache
      const response = await getCategories(genre.id);

      let updatedCache = {...cachedGenres};
      updatedCache[genre.id] = response;
      setCachedGenres(updatedCache);

      setAllCategories(response);
    } else {
      setAllCategories(cachedGenres[genre.id as keyof {}]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.back}
          onPress={() => navigation.navigate('MapSelection')}>
          <Image style={headerStyles.icon} source={miscIcons.back} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>{strings.createTabStack.selectCategories}</Text>
        <TouchableOpacity
          style={headerStyles.confirm}
          onPress={() =>
            navigation.navigate('SelectDestinations', {
              selectedCategories: selectedCategories,
              radius: radius,
              latitude: latitude,
              longitude: longitude,
            })}
          >
          <Image style={headerStyles.icon} source={miscIcons.confirm} />
        </TouchableOpacity>
      </View>
      <View style={genreStyles.container}>
        {genres.map(genre => (
          <TouchableOpacity
            key={genre.id}
            onPress={() => handleGenrePress(genre)}>
            <View style={genreStyles.imageContainer}>
              <Image style={genreStyles.image} source={genre.image} />
            </View>
            <Image style={genreStyles.blur} source={vectors.shape1} />
            <Text style={genreStyles.text}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={modalStyles.container}>

        </View>
      </Modal>
      <View style={selectionStyles.container}>
        {/* <ScrollView contentContainerStyle={selectionStyles.selectedCategoriesList}>
            {selectedCategories.map((selected: any) => (
            <Text key={selected.id} style={selectionStyles.selectedCategoryText}>
              {selected.name}
            </Text>
          ))}
        </ScrollView> */}
      </View>
    </View>
    // <SafeAreaView>
    //   <Modal animationType="slide" transparent={true} visible={modalVisible}>
    //     <View style={styles.modalContainer}>
    //       <View style={styles.modalView}>
    //         <View style={styles.modalHeader}>
    //           <TouchableOpacity
    //             style={styles.back}
    //             onPress={() => {
    //               setModalVisible(false);
    //               setSelectedGenre('');
    //             }}>
    //             <Image source={icons.BackArrow} />
    //           </TouchableOpacity>
    //           <View style={styles.genreHeader}>
    //             <Text style={styles.genreText}>{selectedGenre}</Text>
    //           </View>
    //         </View>
    //         <ScrollView>
    //           <View>
    //             {allCategories
    //               ? allCategories.map(selected => (
    //                   <View key={selected.id}>
    //                     <TouchableOpacity
    //                       onPress={() => {
    //                         if (
    //                           !selectedCategories.find(
    //                             item => item.id === selected.id,
    //                           )
    //                         ) {
    //                           setSelectedCategories(prevCategories => [
    //                             ...prevCategories,
    //                             {id: selected.id, name: selected.name},
    //                           ]);
    //                         } else {
    //                           setSelectedCategories(
    //                             selectedCategories.filter(
    //                               item => item.id !== selected.id,
    //                             ),
    //                           );
    //                         }
    //                       }}>
    //                       <View style={styles.circle}>
    //                         <Image
    //                           source={icons.XButton}
    //                           style={styles.image}
    //                         />
    //                       </View>
    //                       <Text>{selected.name}</Text>
    //                     </TouchableOpacity>
    //                   </View>
    //                 ))
    //               : null}
    //           </View>
    //         </ScrollView>
    //       </View>
    //     </View>
    //   </Modal>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(50),
    width: s(300),
    height: vs(20),
  },
  title: {
    position: 'absolute',
    left: s(25),
    width: s(250),
    fontSize: s(18),
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center'
  },
  back: {
    left: 0,
    width: vs(12),
    height: vs(18),
  },
  confirm: {
    position: 'absolute',
    right: 0,
    width: vs(18),
    height: vs(18),
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
    marginTop: (vs(610) - s(580)) / 2,
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
    borderRadius: s(15),
    backgroundColor: colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: s(15),
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
  }
});

const modalStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: (vs(750) - s(580)) / 2,
    left: s(15),
    width: s(320),
    height: s(480),
    borderRadius: s(20),
    backgroundColor: 'black',
  },
});

const selectionStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: s(100),
    bottom: 0,
    width: '100%',
    borderWidth: 1,
  },  
  selectedCategoriesContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.grey,
    borderWidth: 1,
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
});


// const styles = StyleSheet.create({
//   header: {
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     fontSize: 20,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   categoriesContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   categoriesTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginBottom: 20,
//   },
//   categoriesGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     paddingHorizontal: 30,
//   },
//   genreImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 20,
//   },
  // selectedCategoriesContainer: {
  //   borderTopWidth: 1,
  //   borderTopColor: colors.grey,
  //   paddingTop: 20,
  //   paddingHorizontal: 20,
  //   paddingBottom: 40,
  // },
  // selectedCategoriesTitle: {
  //   fontSize: 20,
  //   fontWeight: '700',
  //   marginBottom: 20,
  // },
  // selectedCategoriesList: {
  //   alignItems: 'flex-start',
  //   flexGrow: 1,
  //   paddingBottom: 20,
  // },
  // selectedCategoryText: {
  //   fontSize: 16,
  //   marginBottom: 10,
//   },
//   doneButton: {
//     backgroundColor: colors.accent,
//     paddingVertical: 10,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//   },
//   doneButtonText: {
//     color: colors.white,
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.fill,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//   },
//   modalView: {
//     backgroundColor: colors.white,
//     width: '100%',
//     height: '80%',
//     borderRadius: 10,
//   },
//   circle: {
//     width: 70,
//     height: 70,
//     borderRadius: 50,
//     backgroundColor: colors.accent,
//     margin: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//   },
//   back: {
//     margin: 10,
//   },
//   SelectGenre: {
//     alignItems: 'center',
//   },
//   genreHeader: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   genreText: {
//     textAlign: 'center',
//     textAlignVertical: 'center',
//     fontSize: 20,
//   },
// });
export default SelectGenres;