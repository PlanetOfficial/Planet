import React from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';

import {colors} from '../../constants/theme';
import {miscIcons} from '../../constants/images';

const W = Dimensions.get('window').width;
const H = Dimensions.get('window').height;

const Event = ({navigation}: {navigation: any}) => {
  return (
    <View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Library')}>
        <Image style={styles.back} source={miscIcons.back} />
      </TouchableOpacity>
      <Text style={styles.name}>Leo's Nasty 19th Birthday</Text>
      <Text style={styles.date}>June 14th, 2023</Text>
      {Places()}
    </View>
  );
};

const Places = () => (
  <SafeAreaView style={styles.cardsContainer}>
    {/* <FlatList
      data={}
      renderItem={({item}) => Place(item.name, item.category, item.image)}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
    /> */}
  </SafeAreaView>
);

const Place = (name: string, category: string, image: any) => (
  <View style={cardStyles.container}>
    <Text style={cardStyles.name}>{name}</Text>
    <Text style={cardStyles.category}>{category}</Text>
    <Image style={cardStyles.image} source={image} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: W,
    height: H,
    backgroundColor: colors.white,
  },
  backButton: {
    position: 'absolute',
    top: 75,
    left: 20,
    width: 20,
    height: 30,
  },
  back: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    tintColor: colors.black,
  },
  name: {
    position: 'absolute',
    top: 70,
    left: 60,
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
  },
  date: {
    position: 'absolute',
    top: 105,
    left: 60,
    fontSize: 16,
    color: colors.accent,
  },
  cardsContainer: {
    position: 'absolute',
    top: 150,
    left: 30,
    width: W - 60,
    height: H - 150,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    width: W - 60,
    height: 200,
    marginBottom: 25,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  category: {
    marginVertical: 2,
    fontSize: 12,
    color: colors.accent,
  },
  image: {
    width: W - 60,
    height: 164,
    borderRadius: 10,
  },
  imageOverlap: {
    bottom: 159,
    left: 5,
    width: W - 70,
    height: 164,
    borderRadius: 10,
    zIndex: -1,
  },
});

export default Event;
