import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
} from 'react-native';
import {s} from 'react-native-size-matters';

import {icons} from '../../constants/icons';
import strings from '../../constants/strings';
import {colors} from '../../constants/colors';

import Text from '../components/Text';
import Icon from '../components/Icon';
import CategoryList from '../components/CategoryList';

import {Category} from '../../utils/interfaces/types';

interface Props {
  navigation: any;
  route: any;
}

const SelectCategories: React.FC<Props> = ({navigation, route}) => {
  const [latitude] = useState<number>(route?.params?.latitude);
  const [longitude] = useState<number>(route?.params?.longitude);
  const [radius] = useState<number>(route?.params?.radius); // in meters

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const onCategorySelect = (category: Category) => {
    if (
      !selectedCategories.find(
        (_category: Category) => _category.id === category.id,
      )
    ) {
      setSelectedCategories((prevCategories: Category[]) => [
        ...prevCategories,
        category,
      ]);
    }
  };

  const removeCategory = (categoryId: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategories(
      selectedCategories.filter(
        (_category: Category) => _category.id !== categoryId,
      ),
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <Icon
            icon={icons.back}
            onPress={() => navigation.navigate('MapSelection')}
          />
          <Text>{strings.createTabStack.selectCategories}</Text>
          <Icon
            icon={icons.confirm}
            disabled={
              !route?.params?.theDestination && selectedCategories.length === 0
            }
            onPress={() => {
              navigation.navigate('SelectDestinations', {
                selectedCategories: selectedCategories,
                radius: radius,
                latitude: latitude,
                longitude: longitude,
                theDestination: route?.params?.theDestination,
              });
            }}
          />
        </View>
      </SafeAreaView>

      <CategoryList onSelect={onCategorySelect} />

      <SafeAreaView>
        <View style={styles.title}>
          <Text size="s" weight="b">
            {strings.createTabStack.selected + ':'}
          </Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.contentContainer}>
            {selectedCategories.length > 0 ? (
              selectedCategories.map((category: Category) => (
                <View key={category.id} style={styles.category}>
                  <Image style={styles.icon} source={{uri: category.icon}} />
                  <TouchableOpacity
                    style={styles.xButton}
                    onPress={() => removeCategory(category.id)}>
                    <Image style={styles.x} source={icons.x} />
                  </TouchableOpacity>
                  <View style={styles.name}>
                    <Text size="xs" numberOfLines={2} center={true}>
                      {category.name}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noCatSelected}>
                <Text color={colors.darkgrey}>
                  {strings.createTabStack.noCategoriesSelected}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: s(40),
    paddingHorizontal: s(20),
    marginBottom: s(20),
  },
  title: {
    marginTop: s(15),
    marginLeft: s(20),
    marginBottom: s(10),
  },
  scrollView: {
    paddingHorizontal: s(20),
  },
  contentContainer: {
    flexDirection: 'row',
    height: s(85),
    minWidth: s(310),
    borderRadius: s(10),
    backgroundColor: colors.grey,
    paddingVertical: s(5),
  },
  noCatSelected: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: s(77.5), // (350 - 2 * 20) / 4
  },
  icon: {
    marginTop: s(5),
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    borderWidth: 1,
    tintColor: colors.black,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  name: {
    width: s(60),
    height: s(30),
    justifyContent: 'center',
  },
  xButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: s(15),
    width: s(18),
    height: s(18),
    backgroundColor: colors.white,
    borderRadius: s(10),
  },
  x: {
    width: '45%',
    height: '45%',
    tintColor: colors.black,
  },
});

export default SelectCategories;
