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
import {
  NestableScrollContainer,
  NestableDraggableFlatList,
} from 'react-native-draggable-flatlist';

const LiveCategorySettings = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const [subcategories, setSubcategories]: [any, any] = useState(
    route?.params?.subcategories,
  );

  const [hiddenSubCategories, setHiddenSubCategories]: [any, any] = useState(
    route?.params?.hiddenSubCategories,
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={headerStyles.container}>
        <TouchableOpacity
          style={headerStyles.button}
          onPress={() =>
            navigation.navigate('LiveCategory', {
              subcategories,
              hiddenSubCategories,
            })
          }>
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
          data={subcategories}
          renderItem={({
            item,
            drag,
            isActive,
          }: {
            item: any;
            drag: any;
            isActive: boolean;
          }) => (
            <View
              style={[
                categoryStyles.container,
                isActive ? categoryStyles.shadow : null,
              ]}>
              <View style={categoryStyles.border} />
              <TouchableOpacity
                onPress={() => {
                  setSubcategories(
                    subcategories.filter(
                      (subcategory: any) => subcategory.id !== item.id,
                    ),
                  );
                  setHiddenSubCategories((_hiddenSubCategory: any) => [
                    ..._hiddenSubCategory,
                    item,
                  ]);
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
          )}
          keyExtractor={(item: any) => item.id}
          onDragEnd={({data}) => setSubcategories(data)}
        />
        <View>
          <Text style={styles.header}>{strings.filter.hidden}:</Text>
        </View>
        <NestableDraggableFlatList
          data={hiddenSubCategories}
          renderItem={({item}: {item: any}) => (
            <View style={categoryStyles.container}>
              <View style={categoryStyles.border} />
              <TouchableOpacity
                onPress={() => {
                  setHiddenSubCategories(
                    hiddenSubCategories.filter(
                      (subcategory: any) => subcategory.id !== item.id,
                    ),
                  );
                  setSubcategories((_subcategories: any) => [
                    ..._subcategories,
                    item,
                  ]);
                }}>
                <Image style={categoryStyles.show} source={icons.plus} />
              </TouchableOpacity>
              <Text style={categoryStyles.hiddenTitle}>{item.title}</Text>
            </View>
          )}
          keyExtractor={(item: any) => item.id}
        />
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
