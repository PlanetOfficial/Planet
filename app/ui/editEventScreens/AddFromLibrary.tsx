import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {s} from 'react-native-size-matters';

import PlaceCard from '../components/PlaceCard';
import Text from '../components/Text';

import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {colors} from '../../constants/theme';

import {getPlaces} from '../../utils/api/placeAPI';
import {Place} from '../../utils/interfaces/types';

interface Props {
  onClose: () => void;
  onSelect: (place: Place) => void;
}

const AddFromLibrary: React.FC<Props> = ({onClose, onSelect}) => {
  const filterRef = useRef<any>(null); // due to forwardRef

  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      // TODO: implement filters

      const _bookmarks = await getPlaces();
      if (_bookmarks) {
        setPlaces(_bookmarks);
      } else {
        Alert.alert('Error', 'Unable to load bookmarks. Please try again.');
      }
    };

    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={headerStyles.container}>
        <Text size="m" weight="b">
          {strings.library.addFromLibrary}
        </Text>
        <TouchableOpacity style={headerStyles.button} onPress={onClose}>
          <Image style={headerStyles.x} source={icons.x} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={places}
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={5}
        keyExtractor={(item: Place) => item.id.toString()}
        ItemSeparatorComponent={Spacer}
        onTouchStart={() => filterRef.current?.closeDropdown()}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text color={colors.darkgrey} center={true}>
              {strings.library.noSaved}
            </Text>
          </View>
        }
        renderItem={({item}: {item: Place}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                onSelect(item);
                onClose();
              }}>
              <PlaceCard
                place={item}
                bookmarked={true}
                setBookmarked={(bookmarked: boolean, place: Place) => {
                  if (!bookmarked) {
                    setPlaces(
                      places.filter((_place: Place) => _place.id !== place.id),
                    );
                  }
                }}
                image={
                  item.photo
                    ? {
                        uri: item.photo,
                      }
                    : icons.defaultIcon
                }
              />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const Spacer = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingTop: s(20),
    paddingBottom: s(40),
  },
  separator: {
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginVertical: s(10),
  },
  card: {
    alignSelf: 'center',
    width: s(290),
  },
  center: {
    height: s(400),
    justifyContent: 'center',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: s(40),
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

export default AddFromLibrary;
