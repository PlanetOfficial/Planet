import React from 'react';
import {View, Text, SafeAreaView, StyleSheet,Image, TouchableOpacity} from 'react-native';
import {colors} from '../../constants/theme';
import { icons } from '../../constants/images';
import strings from '../../constants/strings';
import { s } from 'react-native-size-matters'; 

const Trending = () => {
  return (
    <SafeAreaView testID="trendingScreenView" style={styles.container}>
      <View style={headerStyles.container}>
        <View style={headerStyles.titles}>
          <Text style={headerStyles.title}>{strings.title.trending}</Text>
          <Text style={headerStyles.in}>{strings.trending.in}</Text>
          <TouchableOpacity
            style={headerStyles.fgSelector}
            onPress={() => console.log("switch location")}>
            <Text numberOfLines={1} style={headerStyles.location}>
              Seattle
            </Text>
            <View style={headerStyles.drop}>
              <Image style={[headerStyles.icon]} source={icons.next} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => console.log("TO BE IMPLEMENTED")}>
          <Image style={headerStyles.search} source={icons.search} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: 20,
    fontWeight: '700',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: s(20),
    marginVertical: s(15),
  },
  titles: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontSize: s(24),
    fontWeight: '700',
    color: colors.black,
  },
  in: {
    fontSize: s(22),
    fontWeight: '700',
    color: colors.darkgrey,
    marginHorizontal: s(6),
  },
  location: {
    fontSize: s(25),
    fontWeight: '700',
    color: colors.accent,
  },
  search: {
    width: s(20),
    height: s(20),
    tintColor: colors.black,
  },
  fgSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drop: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(6),
    width: s(15),
    height: s(10),
  },
  icon: {
    width: s(10),
    height: s(15),
    tintColor: colors.black,
    transform: [{rotate: '90deg'}],
  },
});

export default Trending;
