import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {icons, vectors} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';
import {genres} from '../../constants/genres';

const AddByCategory = ({onClose, onSelect}: {onClose: any; onSelect: any}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [allCategories, setAllCategories]: [any, any] = useState([]);

  const handleGenrePress = async (genre: any) => {
    setSelectedGenre(genre.name);
    setModalVisible(true);
    setAllCategories([]);

    // display categories from genre

    // find index of genre
    const genreObj = genres.find(item => item.id === genre.id);
    if (genreObj) {
      setAllCategories(genreObj.categories);
    }
  };
  return (
    <View>
      <View style={headerStyles.container}>
        <Text style={headerStyles.title}>{strings.library.addByCategory}</Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>
      <View style={genreStyles.container}>
        {genres.map(genre => (
          <TouchableOpacity
            key={genre.id}
            onPress={() => handleGenrePress(genre)}>
            <View style={genreStyles.imageContainer}>
              <Image style={genreStyles.image} source={genre.image} />
              <Image style={genreStyles.blur} source={vectors.blur} />
              <Text style={genreStyles.text}>{genre.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <Pressable
          style={modalStyles.container}
          onPress={() => {
            setModalVisible(false);
            setSelectedGenre('');
          }}>
          <View style={modalStyles.modal}>
            <View style={modalStyles.header}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSelectedGenre('');
                }}
                style={modalStyles.x}>
                <Image style={modalStyles.icon} source={icons.x} />
              </TouchableOpacity>
              <Text style={modalStyles.title}>{selectedGenre}</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {allCategories
                ? allCategories?.map((category: any) => (
                    <TouchableOpacity
                      key={category.id}
                      onPress={() => {
                        onSelect(category.id);
                        onClose();
                      }}>
                      <View style={categoryStyles.container}>
                        <Image
                          style={categoryStyles.image}
                          source={category.icon}
                        />
                        <Text style={categoryStyles.name}>{category.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ))
                : null}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(40),
    marginBottom: s(20),
  },
  title: {
    fontSize: s(17),
    fontWeight: '700',
    color: colors.black,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: s(20),
    width: s(22),
    height: s(22),
    borderRadius: s(11),
    backgroundColor: colors.grey,
  },
  x: {
    width: '50%',
    height: '50%',
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
  text: {
    fontSize: s(15),
    fontWeight: '700',
    color: colors.white,
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
  container: {
    paddingTop: s(40),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modal: {
    alignSelf: 'center',
    width: s(250),
    borderRadius: s(10),
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: colors.white,

    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.41,
    shadowRadius: 9.11,
    elevation: 14,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: s(50),
    backgroundColor: colors.grey,
    borderTopLeftRadius: s(8),
    borderTopRightRadius: s(8),
  },
  title: {
    fontSize: s(20),
    fontWeight: '700',
    color: colors.black,
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

export default AddByCategory;
