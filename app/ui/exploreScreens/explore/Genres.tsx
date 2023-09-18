import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  useColorScheme,
  Image,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {s} from 'react-native-size-matters';
import {BlurView} from '@react-native-community/blur';

import colors from '../../../constants/colors';
import icons from '../../../constants/icons';
import strings from '../../../constants/strings';

import Icon from '../../components/Icon';
import Text from '../../components/Text';

import {Coordinate, Genre, ExploreModes} from '../../../utils/types';

interface Props {
  navigation: any;
  myLocation?: Coordinate;
  mode: ExploreModes;
}

const Genres: React.FC<Props> = ({navigation, myLocation, mode}) => {
  const theme = useColorScheme() || 'light';
  const styles = styling(theme);

  const [genres, setGenres] = useState<Genre[]>([]);

  const initializeData = async () => {
    const data = await AsyncStorage.getItem('genres');
    if (data) {
      setGenres(JSON.parse(data));
    } else {
      Alert.alert(strings.error.error, strings.error.loadGenres);
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text size="s">{strings.explore.categories}</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() =>
            navigation.navigate('AllCategories', {
              myLocation,
              mode,
              genres,
            })
          }>
          <Text size="xs" color={colors[theme].accent}>
            {strings.explore.allCategories}
          </Text>
          <View style={styles.next}>
            <Icon size="xs" icon={icons.next} color={colors[theme].accent} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {genres.map((genre: Genre) => (
          <TouchableOpacity
            key={genre.id}
            style={styles.chip}
            onPress={() =>
              navigation.navigate('SearchCategory', {
                category: {
                  id: genre.id * -1,
                  name: genre.name,
                  alias: genre.alias,
                  supplier: genre.supplier,
                  filter: genre.filter,
                  icon: genre.icon,
                },
                myLocation,
                mode,
              })
            }>
            <Image source={{uri: genre.image.url}} style={styles.image} />
            {Platform.OS === 'ios' ? (
              <BlurView
                blurAmount={2}
                blurType={'light'}
                style={styles.image}
              />
            ) : null}
            <View style={[styles.image, styles.overlay]} />
            <Text size="s" color={colors.light.primary}>
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styling = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      marginVertical: s(15),
      marginHorizontal: s(20),
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: s(5),
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    chip: {
      alignItems: 'center',
      justifyContent: 'center',
      width: s(150),
      height: s(55),
      marginBottom: s(10),
      borderRadius: s(5),
      backgroundColor: colors[theme].primary,
      overflow: 'hidden',
    },
    image: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    overlay: {
      backgroundColor: colors[theme].dim,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    next: {
      marginLeft: s(3),
    },
  });

export default Genres;
