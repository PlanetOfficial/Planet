import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {s} from 'react-native-size-matters';

import colors from '../../constants/colors';
import icons from '../../constants/icons';
import strings from '../../constants/strings';
import styles from '../../constants/styles';

import Text from '../components/Text';
import Separator from '../components/Separator';

import {Category, Genre} from '../../utils/interfaces/types';

const Search = ({navigation}: {navigation: any}) => {
  const [genres, setGenres] = useState<Genre[]>([]);

  const initializeData = async () => {
    const data = await AsyncStorage.getItem('genres');
    if (data) {
      setGenres(JSON.parse(data));
    } else {
      Alert.alert('Error', 'Unable to load genres. Please try again.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initializeData();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={genres}
        renderItem={({item}: {item: Genre}) => (
          <View style={categoryStyles.container}>
            <View style={categoryStyles.header}>
              <Text>{item.name}</Text>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={categoryStyles.scrollView}>
              {item.categories.map((category: Category) => (
                <View
                  key={category.id}
                  style={categoryStyles.categoryContainer}>
                  <View style={categoryStyles.iconContainer}>
                    <Image
                      style={categoryStyles.icon}
                      source={{uri: category.icon.url}}
                    />
                  </View>
                  <Text size="xs" weight="l" center={true}>
                    {category.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        ItemSeparatorComponent={Separator}
        keyExtractor={(item: Genre) => item.id.toString()}
      />
    </SafeAreaView>
  );
};

const categoryStyles = StyleSheet.create({
  container: {
    paddingVertical: s(15),
  },
  header: {
    paddingHorizontal: s(20),
    paddingBottom: s(15),
  },
  scrollView: {
    paddingHorizontal: s(20),
  },
  categoryContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(75),
    height: s(75),
    overflow: 'visible',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    borderWidth: s(1),
    borderColor: colors.black,
  },
  icon: {
    width: '70%',
    height: '70%',
  },
});

export default Search;
