import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import CustomText from './Text';

import {icons, vectors} from '../../constants/icons';
import {colors} from '../../constants/colors';

import {Genre, Category} from '../../utils/types';
import {getGenres} from '../../utils/api/genresAPI';

interface Props {
  onSelect: (category: Category) => void;
}

const CategoryList: React.FC<Props> = ({onSelect}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      const _genres: Genre[] | null = await getGenres();

      if (_genres) {
        setGenres(_genres);
      } else {
        Alert.alert('Error', 'Unable to load genres. Please try again.');
      }
    };

    initializeData();
  }, []);

  const handleGenrePress = async (genre: Genre) => {
    setSelectedGenre(genre.name);
    setModalVisible(true);
    setAllCategories([]);

    // find index of genre
    const genreObj: Genre | undefined = genres.find(
      (_genre: Genre) => _genre.id === genre.id,
    );
    if (genreObj) {
      setAllCategories(genreObj.categories);
    }
  };

  return (
    <View style={styles.container}>
      <View style={genreStyles.container}>
        {genres.map((genre: Genre) => (
          <TouchableOpacity
            key={genre.id}
            onPress={() => handleGenrePress(genre)}>
            <View style={genreStyles.imageContainer}>
              <Image style={genreStyles.image} source={{uri: genre.image}} />
              <Image style={genreStyles.blur} source={vectors.blur} />
              <CustomText
                size="m"
                weight="b"
                color={colors.white}
                numberOfLines={2}
                center={true}>
                {genre.name}
              </CustomText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={modalStyles.vertCenter}>
          <View
            style={modalStyles.dim}
            onTouchStart={() => setModalVisible(false)}
          />
          <View style={modalStyles.container}>
            <View style={modalStyles.header}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedGenre('');
                }}
                style={modalStyles.x}>
                <Image style={modalStyles.icon} source={icons.x} />
              </TouchableOpacity>
              <CustomText size="m" weight="b">
                {selectedGenre}
              </CustomText>
            </View>
            {allCategories
              ? allCategories.map((category: Category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => {
                      onSelect(category);
                      setModalVisible(false);
                    }}>
                    <View style={categoryStyles.container}>
                      <Image
                        style={categoryStyles.image}
                        source={{uri: category.icon}}
                      />
                      <Text style={categoryStyles.name}>{category.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              : null}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});

const genreStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: s(15),
    width: s(125),
    height: s(125),
    borderRadius: s(10),
    backgroundColor: colors.white,

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: colors.white,
  },
  blur: {
    position: 'absolute',
    width: s(180),
    height: s(100),
    resizeMode: 'stretch',
    tintColor: colors.black,
    opacity: 0.4,
  },
});

const modalStyles = StyleSheet.create({
  vertCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: s(270),
    backgroundColor: colors.white,
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: colors.white,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: s(40),
    borderTopLeftRadius: s(8),
    borderTopRightRadius: s(8),
    backgroundColor: colors.grey,
  },
  x: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -s(12),
    right: -s(12),
    width: s(25),
    height: s(25),
    backgroundColor: colors.grey,
    borderRadius: s(12.5),
    borderWidth: 1,
    borderColor: colors.darkgrey,
  },
  icon: {
    width: '40%',
    height: '40%',
    tintColor: colors.black,
  },
  dim: {
    position: 'absolute',
    width: '100%',
    height: '110%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: s(60),
    marginHorizontal: s(5),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  image: {
    position: 'absolute',
    width: s(40),
    height: s(40),
    marginLeft: s(10),
    borderRadius: s(20),
    borderWidth: 1,
    tintColor: colors.black,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  name: {
    marginLeft: s(60),
    fontSize: s(14),
    fontWeight: '700',
    color: colors.black,
  },
});

export default CategoryList;
