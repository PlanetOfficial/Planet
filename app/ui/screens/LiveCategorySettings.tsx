import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../constants/theme';
import {icons} from '../../constants/images';
import strings from '../../constants/strings';
import {s} from 'react-native-size-matters';
import {genres} from '../../constants/genres';
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
} from 'react-native-draggable-flatlist';
import {ScrollView} from 'react-native-gesture-handler';

const LiveCategorySettings = ({navigation}: {navigation: any}) => {
  const [categories, setCategories]: [any, any] = useState(
    genres[0].categories[0].subcategories,
  );

  const [hidden, setHidden]: [any, any] = useState([]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.button}
          onPress={() => navigation.navigate('LiveCategory')}>
          <Image style={headerStyles.back} source={icons.next} />
        </TouchableOpacity>
        <Text style={headerStyles.title}>{strings.filter.editView}</Text>
      </SafeAreaView>
      <NestableScrollContainer
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bottomPadding}>
        <View>
          <Text style={styles.header}>{strings.filter.visible}:</Text>
        </View>
        <NestableDraggableFlatList
          data={categories}
          renderItem={({
            item,
            drag,
            isActive,
          }: {
            item: any;
            drag: any;
            isActive: boolean;
          }) => {
            return (
              <View
                style={[
                  categoryStyles.container,
                  isActive ? categoryStyles.shadow : null,
                ]}>
                <View style={categoryStyles.border} />
                <TouchableOpacity
                  onPress={() => {
                    setCategories(
                      categories.filter(
                        (category: any) => category.id !== item.id,
                      ),
                    );
                    setHidden((_hidden: any) => [..._hidden, item]);
                  }}>
                  <Image style={categoryStyles.hide} source={icons.hide} />
                </TouchableOpacity>
                <Text style={categoryStyles.title}>{item.title}</Text>
                <TouchableOpacity
                  delayLongPress={1}
                  onLongPress={drag}
                  disabled={isActive}>
                  <View>
                    <Image style={categoryStyles.drag} source={icons.drag} />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(item: any) => item.id}
          onDragEnd={({data}) => setCategories(data)}
        />
        <View>
          <Text style={styles.header}>{strings.filter.hidden}:</Text>
        </View>
        <ScrollView>
          {hidden.map((item: any) => (
            <View style={categoryStyles.container}>
              <View style={categoryStyles.border} />
              <TouchableOpacity
                onPress={() => {
                  setHidden(
                    hidden.filter((category: any) => category.id !== item.id),
                  );
                  setCategories((_categories: any) => [..._categories, item]);
                }}>
                <Image style={categoryStyles.show} source={icons.plus} />
              </TouchableOpacity>
              <Text style={categoryStyles.hiddenTitle}>{item.title}</Text>
            </View>
          ))}
        </ScrollView>
      </NestableScrollContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    marginHorizontal: s(20),
    marginTop: s(20),
    marginBottom: s(12),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.black,
  },
  bottomPadding: {
    paddingBottom: s(40),
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: s(20),
  },
  title: {
    width: s(250),
    marginRight: s(30),
    marginVertical: s(10),
    fontSize: s(16),
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
  button: {
    width: s(30),
  },
  back: {
    width: s(12),
    height: s(18),
    marginRight: s(6),
    tintColor: colors.black,
    transform: [{rotate: '180deg'}],
  },
});

const categoryStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(20),
    paddingVertical: s(10),
    backgroundColor: colors.white,
  },
  border: {
    position: 'absolute',
    marginHorizontal: s(20),
    width: '100%',
    height: s(38),
    borderBottomWidth: 0.5,
    borderColor: colors.grey,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    position: 'absolute',
    left: s(60),
    width: s(230),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.black,
  },
  hiddenTitle: {
    position: 'absolute',
    left: s(60),
    width: s(230),
    fontSize: s(14),
    fontWeight: '600',
    color: colors.darkgrey,
  },
  hide: {
    marginLeft: s(5),
    width: s(18),
    height: s(18),
    tintColor: colors.darkgrey,
  },
  show: {
    marginLeft: s(5),
    width: s(18),
    height: s(18),
    tintColor: colors.accent,
  },
  drag: {
    width: s(18),
    height: s(18),
    tintColor: colors.darkgrey,
  },
});

export default LiveCategorySettings;
